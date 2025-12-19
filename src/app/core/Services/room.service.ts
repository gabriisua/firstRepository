import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {

  private baseUrl = 'http://localhost:5177';

  constructor(private http: HttpClient) {}

  // Leggere tutte le stanze
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/getrooms`);
  }

  // Creare una stanza
  addRoom(formData: FormData) {
  return this.http.post<Room>(this.baseUrl + '/rooms', formData);
}


  // Cancellare una stanza
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delrooms/${id}`);
  }

  // Leggere una stanza specifica
  getRoomById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/selrooms/${id}`);
  }
}

