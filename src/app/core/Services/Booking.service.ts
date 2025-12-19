import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingDto {
  roomId?: number;
  userId: string;
  startDate: string;
  endDate: string;   
}

export interface BookingResponse {
  id: number;
  roomId: number;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = 'http://localhost:5177';

  constructor(private http: HttpClient) {}

  // Creare una prenotazione
  createBooking(dto: BookingDto): Observable<BookingResponse> {
    if (new Date(dto.endDate) <= new Date(dto.startDate)) {
      throw new Error("La data di fine deve essere successiva alla data di inizio.");
    }

    return this.http.post<BookingResponse>(
      `${this.baseUrl}/bookings`, 
      dto, 
      { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
    );
  }

  // Recuperare tutte le prenotazioni di una stanza
  getBookingsForRoom(roomId: number): Observable<BookingDto[]> {
    return this.http.get<BookingDto[]>(
      `${this.baseUrl}/getbookings/${roomId}`,
      { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
    );
  }
}


