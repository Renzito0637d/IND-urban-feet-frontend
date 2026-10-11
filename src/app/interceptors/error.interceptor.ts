import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Si el error es 401 (No Autorizado)
      if (error.status === 401) {

        // Intentamos refrescar el token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Si el refresh fue exitoso, el backend nos dio una nueva
            // cookie de Access Token. Reintentamos la petición original.
            return next(req);
          }),
          catchError((refreshError) => {
            // Si el refresh TAMBIÉN falla (ej. refresh token expirado)
            // Deslogueamos al usuario y lanzamos el error
            authService.logout().subscribe(); // Llama a logout para limpiar el estado
            return throwError(() => refreshError); // Lanza el error del refresh
          })
        );
      }

      // Para cualquier otro error (404, 500, etc.), solo lanza el error
      return throwError(() => error);
    })
  );
};