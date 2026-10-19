import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MensajeChat {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenteIaService {
  constructor(private http: HttpClient) {}

  enviarMensajes(messages: MensajeChat[]): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>('/api/chat', { messages });
  }
}