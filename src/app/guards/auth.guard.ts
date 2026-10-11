import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    // No está logueado, redirigir a la página de inicio de sesión
    return router.parseUrl('/');
  }

  // 2. Obtener los roles requeridos de la data de la ruta
  const requiredRoles = route.data['roles'] as string[];

  // 3. Verificar si la ruta requiere roles
  if (!requiredRoles || requiredRoles.length === 0) {
    // La ruta no requiere roles específicos, solo autenticación.
    // Como ya pasó el chequeo de isAuthenticated(), permitimos el acceso.
    return true;
  }

  // 4. Verificar si el usuario tiene los roles requeridos
  if (authService.hasRoles(requiredRoles)) {
    // El usuario tiene el rol necesario, permitir acceso
    return true;
  } else {
    // El usuario está logueado pero NO tiene el rol necesario.
    // Redirigir a una página de "acceso denegado" o al home.
    console.warn('Acceso denegado: El usuario no tiene los roles requeridos.');
    // Es buena idea tener una ruta específica para "acceso denegado"
    // return router.parseUrl('/unauthorized');
    // Por ahora, lo redirigimos al home:
    return router.parseUrl('/');
  }
};
