import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoRequest, PedidoResponse } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private baseUrl = '/pedidos';

  crearPedido(request: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.baseUrl, request);
  }

  listarMisPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.baseUrl);
  }

  cancelarPedido(id: number): Observable<void> {
    // PATCH suele requerir un cuerpo, aunque sea vacío
    return this.http.patch<void>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  getAllAdmin(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.baseUrl}/all`);
  }

  // Actualizar estado (PATCH)
  updateStatus(id: number, nuevoEstado: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/estado`, { estado: nuevoEstado });
  }

  // Actualizar pedido completo (Admin editando cantidades/dirección)
  updatePedido(id: number, data: any): Observable<PedidoResponse> {
    // CAMBIO AQUÍ: Apuntamos a /admin/{id}
    return this.http.put<PedidoResponse>(`${this.baseUrl}/admin/${id}`, data);
  }

  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}