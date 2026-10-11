import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Variacion } from '../models/variaciones.model';

@Injectable({
  providedIn: 'root'
})
export class VariacionesService {
  private http = inject(HttpClient);
  // Base del controlador que me pasaste
  private baseUrl = '/zapatilla-variacion';

  // GET: /zapatilla-variacion/zapatillas/{id}
  getByZapatillaId(id: number): Observable<Variacion[]> {
    return this.http.get<Variacion[]>(`${this.baseUrl}/zapatillas/${id}`);
  }

  // POST: /zapatilla-variacion/zapatilla/{id}
  create(zapatillaId: number, payload: any): Observable<Variacion[]> {
    return this.http.post<Variacion[]>(`${this.baseUrl}/zapatilla/${zapatillaId}`, payload);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data); // Asumiendo que tu endpoint PUT es /zapatilla-variacion/{id}
  }

  // (Opcional) DELETE si lo implementas luego
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
