import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.html']
})
export class RegisterComponent {
  // Dati dell'utente, tutto definito qui, niente DTO
  newUser = {
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
  };

  confirmPassword = '';
  successMessage = '';
  errorMessage = '';
  private apiUrl = 'http://localhost:5177/register'; // Endpoint backend


  constructor(private http: HttpClient, private router: Router) {}

  
  register() {
    this.successMessage = '';
    this.errorMessage = '';

        if (this.newUser.password !== this.confirmPassword) {
      this.errorMessage = 'Le password non coincidono!';
      return;
    }

    // Chiamata HTTP POST direttamente con l'oggetto newUser
    this.http.post<any>(this.apiUrl, this.newUser).subscribe({
      next: res => this.successMessage = 'Registrazione avvenuta con successo!',
      error: err => this.errorMessage = err.error || 'Errore durante la registrazione'
    });
    
  }
  goToLogin(){
    this.router.navigate(['/login'])
  }
    resetPassword() {
    console.log('Vai alla pagina di reset password');
  }
}