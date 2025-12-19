import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/Services/AuthService';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isAuthenticated = false;
  isAdmin = false;

  constructor(private auth: AuthService, private router: Router) {
    // Stato iniziale
    this.updateState();

    // Aggiornamenti dinamici
    this.auth.roles$.subscribe(() => this.updateState());
  }

  private updateState() {
    this.isAuthenticated = !!this.auth.getToken(); // Controlla direttamente il token
    const normalizedRoles = this.auth.getUserRole().map(r => r.trim().toLowerCase());
    this.isAdmin = normalizedRoles.includes('admin');
  }

  logout() {
  const rememberMe = !!localStorage.getItem('rememberedUsername');

  // Se rememberMe è true → non cancellare refresh token
  this.auth.logout(!rememberMe);

  this.router.navigate(['/']);
}

}


