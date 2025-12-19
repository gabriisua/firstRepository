import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsService } from '../../core/Services/room.service';
import { BookingService,BookingDto } from '../../core/Services/Booking.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Room } from '../../models/room.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  
  rooms: Room[] = [];
  selectedRoom: Room | null = null;
  totalPreview: number | null = null;

  bookingDates = { startDate: null as Date | null, endDate: null as Date | null };
  bookedDates: { start: Date; end: Date }[] = [];

  constructor(
    private roomsService: RoomsService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.roomsService.getRooms().subscribe((res) => (this.rooms = res));
  }

  today(): Date {
    return new Date();
  }

  toggleRoom(room: Room) {
    const closing = this.selectedRoom === room;
    this.selectedRoom = closing ? null : room;

    if (!closing && room.id) {
      this.bookingService.getBookingsForRoom(room.id).subscribe(res => {
        this.bookedDates = res.map(b => ({
          start: new Date(b.startDate),
          end: new Date(b.endDate)
        }));

        // Reset datepicker 
        this.bookingDates = { startDate: null, endDate: null };
      });
    }
  }

  // filtro date prenotate
  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    return !this.bookedDates.some(b => d >= b.start && d <= b.end);
  };

  // controllo ulteriore
  isDateBooked(date: Date): boolean {
    return this.bookedDates.some(b => date >= b.start && date <= b.end);
  }

  stringToDate(dateStr: string): Date {
    return new Date(dateStr + 'T00:00:00');
  }

  // invio prenotaz
  submitBooking() {
    if (!this.selectedRoom) return;

    const token = sessionStorage.getItem("token");
    let userId = '';

    if (token) {
      const decoded: any = jwtDecode(token);
      userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    }

    if (!userId) {
      alert("Errore nel recupero dell'utente dal token");
      return;
    }

    const start = this.bookingDates.startDate!;
    const end = this.bookingDates.endDate!;

    // Blocco date già prenotate
    if (this.bookedDates.some(b => b.start < end && b.end > start)) {
      alert("La stanza è già prenotata in questo intervallo di date");
      return;
    }

    const booking: BookingDto = {
      roomId: this.selectedRoom!.id!,
      userId: userId,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };

    this.bookingService.createBooking(booking).subscribe({
      next: () => {
        alert('Prenotazione creata!');
        this.selectedRoom = null;
        this.bookingDates = { startDate: null, endDate: null };
      },
      error: (err) => {
        if (err.status === 409)
          alert('La stanza è già prenotata in questo intervallo di date');
        else
          alert('Errore: ' + err.message);
      }
    });
  }

  getRoomImage(imagePath?: string): string {
    if (!imagePath) return 'assets/default-room.jpg';
    const path = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `http://localhost:5177/${path}`;
  }

  openRoom(room: Room) {
  if (this.selectedRoom === room) return;

  this.selectedRoom = room;

  if (room.id) {
    this.bookingService.getBookingsForRoom(room.id).subscribe(res => {
      this.bookedDates = res.map(b => ({
        start: new Date(b.startDate),
        end: new Date(b.endDate)
      }));

      this.bookingDates = { startDate: null, endDate: null };
    });
  }
}

updateTotalPreview() {
  if (this.bookingDates.startDate && this.bookingDates.endDate && this.selectedRoom) {
    const nights = this.calculateNights(this.bookingDates.startDate, this.bookingDates.endDate);
    this.totalPreview = nights * this.selectedRoom.pricePerNight;
  } else {
    this.totalPreview = null;
  }
}

calculateNights(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

closeRoom(event: Event) {
  event.stopPropagation();       // evita che il click si propaghi alla card
  this.selectedRoom = null;      // chiude la card
  this.totalPreview = null;      // resetta il totale
  this.bookingDates = { startDate: null, endDate: null }; // opzionale: resetta le date
}
}


