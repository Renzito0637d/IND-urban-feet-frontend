import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, PageResponse, UserRequest } from '../models/user.model';
import { AuthResponse } from '../models/auth.model'; // Para el retorno al crear usuarios

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Definimos la ruta base igual que en tu Controller: @RequestMapping("/api/users")
  private baseUrl = '/users';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista paginada de CLIENTES.
   * Endpoint: GET /api/users/clients?page=0&size=5
   */
  getClients(page: number = 0, size: number = 5): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<User>>(`${this.baseUrl}/clients`, { params });
  }

  /**
   * Obtiene la lista paginada de USUARIOS INTERNOS (Admin, Ventas, etc).
   * Endpoint: GET /api/users/internal?page=0&size=5
   */
  getInternalUsers(page: number = 0, size: number = 5): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get<PageResponse<User>>(`${this.baseUrl}/internal`, { params });
  }

  /**
   * Obtiene un usuario por ID (útil para edición).
   * Endpoint: GET /api/users/{id}
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Crea un nuevo CLIENTE.
   * Endpoint: POST /api/users/clients
   * Retorna AuthResponse porque tu backend devuelve el token al registrar.
   */
  createClient(request: UserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/clients`, request);
  }

  /**
   * Crea un nuevo USUARIO INTERNO.
   * Endpoint: POST /api/users/internal
   */
  createInternalUser(request: UserRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/internal`, request);
  }

  updateUser(id: number, data: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  changePassword(id: number, password: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/password`, { password });
  }

  /**
   * Eliminar usuario.
   * Endpoint: DELETE /api/users/{id}
   * Nota: Necesitas agregar este endpoint en tu UserController si aún no está.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}