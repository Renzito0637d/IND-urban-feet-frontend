import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zapatilla, ZapatillaFilter, ZapatillaRequest } from '../models/zapatilla.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class ZapatillaService {
  private http = inject(HttpClient);

  private baseUrl = '/zapatilla';

  getPaginated(page: number, size: number): Observable<Page<Zapatilla>> {
    let params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Zapatilla>>(`${this.baseUrl}/page`, { params });
  }

  getPaginatedPublic(page: number, size: number, filters?: ZapatillaFilter): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (filters) {
      if (filters.marcas && filters.marcas.length > 0) {
        // Para enviar array: marcas=Nike&marcas=Adidas
        filters.marcas.forEach(m => params = params.append('marcas', m));
      }
      if (filters.genero) params = params.set('genero', filters.genero);
      if (filters.tipo) params = params.set('tipo', filters.tipo);
      if (filters.talla) params = params.set('talla', filters.talla);
      if (filters.min) params = params.set('min', filters.min);
      if (filters.max) params = params.set('max', filters.max);
    }

    return this.http.get<any>(`${this.baseUrl}/public/list`, { params });
  }

  getById(id: number): Observable<Zapatilla> {
    return this.http.get<Zapatilla>(`${this.baseUrl}/${id}`);
  }

  create(data: ZapatillaRequest): Observable<Zapatilla> {
    return this.http.post<Zapatilla>(this.baseUrl, data);
  }

  update(id: number, data: ZapatillaRequest): Observable<Zapatilla> {
    return this.http.put<Zapatilla>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}