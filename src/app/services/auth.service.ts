import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of, switchMap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Guarda el estado del usuario (null si no está logueado)
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  // Observable público para que los componentes sepan quién es el usuario
  public currentUser$ = this.currentUserSubject.asObservable();

  // Observable 'isLoggedIn' para que los Guards lo usen fácilmente
  public isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map(user => !!user) // true si user no es null, false si es null
  );

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<User | null> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      // Usa switchMap para encadenar la siguiente llamada
      switchMap(() => {
        // Llama a /me para obtener los datos del usuario (con roles)
        // checkAuthStatus() ya guarda el usuario en currentUserSubject
        return this.checkAuthStatus();
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/registerCliente', request);
  }

  logout(): Observable<any> {
    return this.http.post('/auth/logout', {}).pipe(
      tap(() => {
        // Borramos al usuario del estado de Angular
        this.currentUserSubject.next(null);
      }),
      catchError(err => {
        // Incluso si hay un error (ej. 401), deslogueamos al usuario
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post('/auth/refresh', {});
  }

  checkAuthStatus(): Observable<User | null> {
    // Llama a tu endpoint /me
    return this.http.get<User>('/auth/me').pipe(
      tap(user => {
        // Si la cookie es válida, Spring devuelve al usuario
        this.currentUserSubject.next(user);
      }),
      catchError(err => {
        // Si hay error (401, 403), la cookie no es válida o expiró
        this.currentUserSubject.next(null);
        return of(null); // Devuelve un observable nulo para que APP_INITIALIZER continúe
      })
    );
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value; // Devuelve true si hay un usuario, false si no
  }

  hasRoles(requiredRoles: string[]): boolean {
    const currentUser = this.currentUserSubject.value;

    if (!currentUser || !currentUser.roles) {
      return false;
    }

    // Normalizamos los roles del backend (ej. "ROLE_ADMIN" -> "ADMIN")
    const userRoles = currentUser.roles.map(role =>
      role.startsWith('ROLE_') ? role.substring(5) : role
    );

    // Comprueba si el usuario tiene AL MENOS UNO de los roles requeridos.
    return requiredRoles.some(role => userRoles.includes(role.toUpperCase()));
  }
}