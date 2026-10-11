import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Carrito, CarritoItem, CarritoItemRequest, CarritoItemResponse } from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {// Base para la gestión de items (según tu petición)
  private baseUrl = '/carrito-items';

  // Endpoint auxiliar para obtener el carrito completo (CarritoController)
  private cartUrl = '/carrito';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene el carrito completo del usuario logueado.
   * Endpoint: GET /carrito
   */
  getCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(this.cartUrl);
  }

  /**
   * Agrega un item al carrito o incrementa si ya existe.
   * Endpoint: POST /carrito-items
   */
  addItem(request: CarritoItemRequest): Observable<CarritoItemResponse> {
    return this.http.post<CarritoItemResponse>(this.baseUrl, request);
  }

  /**
   * Modifica la cantidad de un item (+ o -).
   * Endpoint: PATCH /carrito-items/{id}/cantidad?op=increment
   */
  updateCantidad(itemId: number, operacion: 'increment' | 'decrement'): Observable<CarritoItemResponse> {
    const params = new HttpParams().set('op', operacion);

    return this.http.patch<CarritoItemResponse>(
      `${this.baseUrl}/${itemId}/cantidad`,
      {}, // Body vacío
      { params }
    );
  }

  /**
   * Elimina un item del carrito.
   * Endpoint: DELETE /carrito-items/{id}
   */
  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene un item específico por ID (Opcional, ya que sueles cargar todo el carrito).
   * Endpoint: GET /carrito-items/{id}
   */
  getItemById(id: number): Observable<CarritoItem> {
    return this.http.get<CarritoItem>(`${this.baseUrl}/${id}`);
  }
}
