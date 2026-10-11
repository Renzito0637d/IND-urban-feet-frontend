import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosUsuarioReclamo, ReclamacionRequest, ReclamacionResponse } from '../models/reclamo.model';

@Injectable({
  providedIn: 'root'
})
export class ReclamoService {
  private http = inject(HttpClient);
  private baseUrl = '/reclamaciones';

  getDatosUsuario(): Observable<DatosUsuarioReclamo> {
    return this.http.get<DatosUsuarioReclamo>(`${this.baseUrl}/usuario`);
  }

  crearReclamo(data: ReclamacionRequest): Observable<ReclamacionResponse> {
    return this.http.post<ReclamacionResponse>(this.baseUrl, data);
  }

  obtenerMisReclamos(): Observable<ReclamacionResponse[]> {
    return this.http.get<ReclamacionResponse[]>(`${this.baseUrl}/mis-reclamos`);
  }
  obtenerTodos(): Observable<ReclamacionResponse[]> {
    return this.http.get<ReclamacionResponse[]>(this.baseUrl);
  }

  // Actualizar reclamo (usaremos esto para cambiar el estado)
  actualizar(id: number, data: any): Observable<ReclamacionResponse> {
    return this.http.put<ReclamacionResponse>(`${this.baseUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}