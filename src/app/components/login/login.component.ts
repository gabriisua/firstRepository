import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/Services/AuthService';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../core/Services/loader.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
//compilazione automatica
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      this.username = rememberedUsername;
      this.rememberMe = true;
    }
  }

  login(): void {
  if (!this.username || !this.password) {
    alert('Compila tutti i campi');
    return;
  }

  // Mostra spinner
  this.loaderService.show();

  this.authService.login(this.username, this.password, this.rememberMe).pipe (delay(500))
    .subscribe({
      next: () => {
        // Nascondi spinner
        this.loaderService.hide();

        if (this.rememberMe) {
          localStorage.setItem('rememberedUsername', this.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }

        this.router.navigate(['/booking']);
      },
      error: () => {
        // Nascondi spinner anche in caso di errore
        this.loaderService.hide();
        alert('Credenziali errate');
      }
    });
}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  resetPassword(): void {
    this.router.navigate(['/forgot']);
  }
}




