import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5177';

  private rolesSubject = new BehaviorSubject<string[]>(this.getUserRoleFromToken());
  roles$ = this.rolesSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string, rememberMe: boolean) {
  return this.http.post<LoginResponse>(
    `${this.apiUrl}/login`,
    { username, password, rememberMe },
    { withCredentials: true } 
  ).pipe(
    tap(res => {
      sessionStorage.setItem('token', res.token);
      this.rolesSubject.next(this.getUserRoleFromToken());
    })
  );
}

  refreshToken() {
  return this.http.post<LoginResponse>(
    `${this.apiUrl}/refresh-token`,
    {},
    { withCredentials: true }
  ).pipe(
    tap(res => {
      sessionStorage.setItem('token', res.token);
      this.rolesSubject.next(this.getUserRoleFromToken());
      console.log('Access token rinnovato');
    })
  );
}



  logout(rememberMe: boolean) {
  sessionStorage.removeItem('token');
  this.rolesSubject.next([]);

  if (!rememberMe) {
    // qui eventualmente chiami una revoke API (opzionale)
    console.log('Logout completo, non verrai ricordato');
  }
}


  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string[] {
    return this.rolesSubject.getValue();
  }

  private getUserRoleFromToken(): string[] {
    const token = this.getToken();
    if (!token) return [];
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (Array.isArray(roles)) return roles;
      if (typeof roles === 'string') return [roles];
      return [];
    } catch (e) {
      console.error('Token non valido', e);
      return [];
    }
  }
}



