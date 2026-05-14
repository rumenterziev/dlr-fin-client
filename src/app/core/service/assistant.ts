import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  private apiUrl = '/api/v1/assistant/chat';

  constructor(private http: HttpClient) {}

  sendPrompt(prompt: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(this.apiUrl, { prompt });
  }
}
