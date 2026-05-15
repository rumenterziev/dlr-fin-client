import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssistantService } from '../../../core/service/assistant';
import { SeoService } from '../../../core/service/seo';
import { ChatMessage } from '../../../core/model/chat-message.model';

@Component({
  selector: 'app-assistant',
  imports: [CommonModule, FormsModule],
  templateUrl: './assistant.html',
  styleUrl: './assistant.scss',
})
export class Assistant {
  @ViewChild('scrollContainer')
  private scrollContainer?: ElementRef<HTMLElement>;

  private readonly assistantService = inject(AssistantService);
  private readonly snack = inject(MatSnackBar);

  constructor() {
    inject(SeoService).update({
      title: 'AI Chat Assistant',
      description:
        'Chat with an AI assistant for code help, summaries and explanations. Smooth streaming UI with Markdown support.',
      path: '/applications/chat-ai',
    });
  }

  messages: ChatMessage[] = [];
  userInput = '';
  isTyping = false;
  showScrollFab = false;
  private shouldScroll = true;

  readonly suggestions: string[] = [
    'Explain the difference between let, const, and var',
    'What is dependency injection in Angular?',
    'Give me a Spring Boot REST controller example',
    'How do I deploy an Angular app to Azure?',
  ];

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  @HostListener('window:resize')
  onResize(): void {}

  onScroll(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.showScrollFab = distance > 200;
  }

  useSuggestion(s: string): void {
    this.userInput = s;
    this.sendMessage();
  }

  newChat(): void {
    this.messages = [];
    this.userInput = '';
    this.isTyping = false;
  }

  sendMessage(): void {
    const input = this.userInput.trim();
    if (!input || this.isTyping) return;
    this.messages.push({ sender: 'user', text: input });
    this.userInput = '';
    this.shouldScroll = true;
    this.requestAi(input);
  }

  regenerate(): void {
    const lastUser = [...this.messages].reverse().find((m) => m.sender === 'user');
    if (!lastUser) return;
    this.requestAi(lastUser.text);
  }

  copyMessage(text: string): void {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      this.snack.open('Copied to clipboard', 'Dismiss', {
        duration: 2000,
        panelClass: ['snack-success'],
      });
    });
  }

  scrollToBottomFromFab(): void {
    this.shouldScroll = true;
    this.scrollToBottom();
  }

  private requestAi(prompt: string): void {
    this.isTyping = true;
    this.shouldScroll = true;
    this.assistantService.sendPrompt(prompt).subscribe({
      next: (res) => {
        this.messages.push({ sender: 'ai', text: res.response });
        this.isTyping = false;
        this.shouldScroll = true;
      },
      error: (err) => {
        console.error(err);
        this.messages.push({
          sender: 'ai',
          text: 'Sorry, something went wrong. Please try again.',
        });
        this.isTyping = false;
        this.shouldScroll = true;
      },
    });
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
