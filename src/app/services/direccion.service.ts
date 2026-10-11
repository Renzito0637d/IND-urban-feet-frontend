import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Direccion } from '../models/direccion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {
  private http = inject(HttpClient);
  private baseUrl = '/directions';

  // Obtener direciones del user autenticado del backend
  getAll(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(this.baseUrl);
  }

  create(data: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(this.baseUrl, data);
  }

  update(id: number, data: Direccion): Observable<Direccion> {
    return this.http.put<Direccion>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  constructor() { }
}
