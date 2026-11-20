import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChatProductSummary, ChatService } from '../../services/chat.service';
import { ZapatillaService } from '../../services/zapatilla.service';
import { ProductoDetalleComponent } from '../producto-detalle/producto-detalle.component';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time: string;
  products?: ChatProductSummary[];
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.css'
})
export class ChatWidgetComponent {
  private chatService = inject(ChatService);
  private zapatillaService = inject(ZapatillaService);
  private dialog = inject(MatDialog);

  @ViewChild('chatMessagesContainer') private chatContainer?: ElementRef;

  // Estado reactivo con Signals (Angular 19)
  isOpen = signal<boolean>(false);
  userInput = signal<string>('');
  isLoading = signal<boolean>(false);

  // Preguntas frecuentes sugeridas
  suggestedQuestions: string[] = [
    '📏 ¿Cómo saber mi talla correcta en zapatillas importadas?',
    '👟 ¿Qué zapatillas recomiendas para trotar o running?',
    '🚚 ¿Cuál es la política de envío gratis y cobertura?',
    '🎨 ¿Qué siluetas combinan con ropa casual o urbana?'
  ];

  // Historial de mensajes
  messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: '¡Hola! 👋 Soy UrbanBot, tu asesor de estilo e inteligencia de calzado en Urban Feet impulsado por Google Gemini.\n\n¿En qué puedo orientarte hoy? Puedes elegir una de las preguntas frecuentes o escribir tu consulta directa.',
      time: this.getCurrentTime()
    }
  ]);

  toggleChat(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.scrollToBottom();
    }
  }

  sendSuggestedQuestion(question: string): void {
    if (this.isLoading()) return;
    this.processUserMessage(question);
  }

  sendMessage(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const text = this.userInput().trim();
    if (!text || this.isLoading()) {
      return;
    }

    this.processUserMessage(text);
    this.userInput.set('');
  }

  openProductModal(productId: number): void {
    this.zapatillaService.getById(productId).subscribe({
      next: (zap) => {
        this.dialog.open(ProductoDetalleComponent, {
          width: '1000px',
          maxWidth: '100vw',
          maxHeight: '90vh',
          panelClass: 'custom-dialog-container',
          data: zap
        });
      },
      error: (err) => {
        console.error('Error al abrir modal de producto desde chat:', err);
      }
    });
  }

  private processUserMessage(text: string): void {
    const time = this.getCurrentTime();

    // 1. Agregar mensaje del usuario a la conversación
    this.messages.update((prev) => [...prev, { sender: 'user', text, time }]);
    this.isLoading.set(true);
    this.scrollToBottom();

    // 2. Conectar al backend con Gemini Flash API y Grounding de Inventario
    this.chatService.sendMessage(text).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.messages.update((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: res.reply,
            time: this.getCurrentTime(),
            products: res.products || []
          }
        ]);
        this.scrollToBottom();
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error al consultar chat backend:', err);

        // Mensaje de respaldo amigable
        this.messages.update((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: '⚠️ No pudimos conectar con el servidor en este momento. Por favor verifica que el backend esté en ejecución o inténtalo nuevamente en unos instantes.',
            time: this.getCurrentTime()
          }
        ]);
        this.scrollToBottom();
      }
    });
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
