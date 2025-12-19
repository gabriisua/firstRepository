import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface CookieConsentDto {
  consentType: string;
  accepted: boolean;
}

@Component({
  selector: 'app-cookies-modal',
  standalone: true,
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.css']
})
export class CookiesModalComponent {

  constructor(
    public dialogRef: MatDialogRef<CookiesModalComponent>,
    private http: HttpClient
  ) {}

  private saveConsent(consent: CookieConsentDto) {
    return this.http.post('http://localhost:5177/cookiesave', consent, { withCredentials: true })
      .pipe(
        catchError(err => {
          console.error('Errore salvataggio consenso:', err);
          return of(null);
        })
      );
  }

  acceptCookies() {
    const consent: CookieConsentDto = { consentType: 'all', accepted: true };
    this.saveConsent(consent).subscribe(() => {
      localStorage.setItem('cookiesAccepted', 'true');
      this.dialogRef.close();
    });
  }

  declineCookies() {
    const consent: CookieConsentDto = { consentType: 'all', accepted: false };
    this.saveConsent(consent).subscribe(() => {
      localStorage.setItem('cookiesAccepted', 'false');
      this.dialogRef.close();
    });
  }
}

