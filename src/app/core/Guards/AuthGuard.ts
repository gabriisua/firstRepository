import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const expectedRoles: string[] = route.data['roles'] || [];
  if (!expectedRoles.length) return true; // se nessun ruolo richiesto, accesso consentito

  const userRoles = authService.getUserRole().map(r => r.toLowerCase());
  const expectedRolesLower = expectedRoles.map(r => r.toLowerCase());

  const hasRole = userRoles.some(r => expectedRolesLower.includes(r));
  if (!hasRole) {
    router.navigate(['/login']); // o pagina “no permission”
    return false;
  }

  return true;
};

