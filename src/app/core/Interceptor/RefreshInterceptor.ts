import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/AuthService';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(err => {

      // Solo 401
      if (err.status !== 401) {
        return throwError(() => err);
      }

      // Evita loop infinito
      if (req.url.includes('/refresh-token') || req.url.includes('/login')) {
        return throwError(() => err);
      }

      // Tenta refresh
      return authService.refreshToken().pipe(
        switchMap(res => {
          const newToken = res.token;

          // Ripeti la richiesta originale
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });

          return next(retryReq);
        }),
        catchError(refreshErr => {
          authService.logout(true);
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
