import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private http = inject(HttpClient);
  private baseUrl = '/ventas';

  getAll(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.baseUrl}/all`);
  }
}