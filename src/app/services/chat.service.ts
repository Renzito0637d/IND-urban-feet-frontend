import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatProductSummary {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  imagenUrl?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
  products?: ChatProductSummary[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private endpoint = '/chat';

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.endpoint, { message });
  }
}
