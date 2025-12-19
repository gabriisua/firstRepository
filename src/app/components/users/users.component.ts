import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:5177/users').subscribe({
      next: res => this.users = res,
      error: err => console.error('Errore caricamento utenti', err)
    });
  }

  saveUser(user: User): void {
    this.http.post('http://localhost:5177/update', user).subscribe({
      next: () => {
        this.successMessage = `Utente "${user.username}" aggiornato con successo!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => console.error('Errore aggiornamento utente', err)
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return;

    this.http.delete(`http://localhost:5177/delete/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.successMessage = `Utente eliminato con successo!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => console.error('Errore eliminazione utente', err)
    });
  }
}
