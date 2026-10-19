import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AsistenteIaService,
  MensajeChat
} from '../servicios/asistente-ia.service';

@Component({
  selector: 'app-asistente-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistente-chat.component.html',
  styleUrl: './asistente-chat.component.css'
})
export class AsistenteChatComponent {
  abierto = false;
  enviando = false;
  texto = '';
  error = '';

  mensajes: MensajeChat[] = [
    {
      role: 'assistant',
      content: 'Hola, soy el asistente de OrientaLab. ¿En qué puedo ayudarte con tu búsqueda de empleo o formación?'
    }
  ];

  constructor(private asistenteIa: AsistenteIaService) {}

  enviar(): void {
    const contenido = this.texto.trim();

    if (!contenido || this.enviando) {
      return;
    }

    this.mensajes = [
      ...this.mensajes,
      { role: 'user', content: contenido }
    ];
    this.texto = '';
    this.error = '';
    this.enviando = true;

    this.asistenteIa.enviarMensajes(this.mensajes.slice(-12)).subscribe({
      next: ({ reply }) => {
        this.mensajes = [
          ...this.mensajes,
          { role: 'assistant', content: reply }
        ];
        this.enviando = false;
      },
      error: (error) => {
        this.error = error.error?.error || 'No se pudo enviar el mensaje.';
        this.enviando = false;
      }
    });
  }
}