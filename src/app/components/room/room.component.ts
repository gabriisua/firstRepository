import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { RoomsService } from '../../core/Services/room.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../public/navbar/navbar.component';

interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  role: string;
} 

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [NavbarComponent,CommonModule, FormsModule,RouterModule],
  styleUrls: ['./room.component.css'],
  templateUrl: './room.component.html',
})
export class RoomsComponent implements OnInit {

  // ---------- Rooms ----------
  rooms: Room[] = [];
  selectedImage?: File;
  successMessage: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 2;
  newRoom: Room = { name: '', beds: 1, pricePerNight: 0 };

  // ---------- Users ----------
  users: any[] = [];
  showUsersModal: boolean= true;

  constructor(private roomsService: RoomsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  // ---------------- ROOMS ----------------
  loadRooms(): void {
    this.roomsService.getRooms().subscribe(res => this.rooms = res);
  }

  addRoom(): void {
    if (!this.newRoom.name || !this.newRoom.beds || !this.newRoom.pricePerNight || !this.selectedImage) {
      alert('Compila tutti i campi e seleziona un\'immagine!');
      return;
    }

    const formData = new FormData();
    formData.append("name", this.newRoom.name);
    formData.append("beds", this.newRoom.beds.toString());
    formData.append("pricePerNight", this.newRoom.pricePerNight.toString());
    if (this.selectedImage) formData.append("image", this.selectedImage);

    this.roomsService.addRoom(formData).subscribe({
      next: (res) => {
        this.rooms.push(res);
        this.newRoom = { name: '', beds: 1, pricePerNight: 0 };
        this.selectedImage = undefined;
        const fileInput = document.getElementById('roomImage') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        this.successMessage = `Camera "${res.name}" aggiunta con successo!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.successMessage = 'Errore durante l\'aggiunta della camera.';
        setTimeout(() => this.successMessage = '', 3000);
      }
    });
  }

  deleteRoom(id: number): void {
    if (!confirm("Sei sicuro di voler cancellare questa stanza?")) return;
    this.roomsService.deleteRoom(id).subscribe(() => {
      this.rooms = this.rooms.filter(r => r.id !== id);
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedImage = file;
  }

  get totalPages(): number {
    return Math.ceil(this.rooms.length / this.itemsPerPage);
  }

  get pagedRooms() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.rooms.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage() { this.goToPage(this.currentPage + 1); }
  prevPage() { this.goToPage(this.currentPage - 1); }

}
