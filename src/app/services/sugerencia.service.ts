import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SugerenciaRequest, SugerenciaResponse } from '../models/sugerencia.model';

@Injectable({
  providedIn: 'root'
})
export class SugerenciaService {

  // Misma lógica que UserService
  private baseUrl = '/sugerencias';

  constructor(private http: HttpClient) {}

  /**
   * LISTAR sugerencias
   * GET /sugerencias
   */
  listar(): Observable<SugerenciaResponse[]> {
    return this.http.get<SugerenciaResponse[]>(`${this.baseUrl}`);
  }

  /**
   * OBTENER sugerencia por ID
   * GET /sugerencias/{id}
   */
  obtener(id: number): Observable<SugerenciaResponse> {
    return this.http.get<SugerenciaResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * CREAR sugerencia
   * POST /sugerencias
   */
  crear(request: SugerenciaRequest): Observable<SugerenciaResponse> {
    return this.http.post<SugerenciaResponse>(`${this.baseUrl}`, request);
  }

  /**
   * ACTUALIZAR sugerencia
   * PUT /sugerencias/{id}
   */
  actualizar(id: number, request: SugerenciaRequest): Observable<SugerenciaResponse> {
    return this.http.put<SugerenciaResponse>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * ELIMINAR sugerencia
   * DELETE /sugerencias/{id}
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
