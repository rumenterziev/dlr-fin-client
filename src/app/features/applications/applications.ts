import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth';
import { SeoService } from '../../core/service/seo';

interface AppCard {
  route: string;
  icon: string;
  tag: string;
  title: string;
  description: string;
  requiresAuth: boolean;
}

@Component({
  selector: 'app-applications',
  imports: [CommonModule, RouterModule],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Applications {
  private readonly auth = inject(AuthService);

  readonly isAuthenticated = computed(() => !!this.auth.user());

  constructor() {
    inject(SeoService).update({
      title: 'Applications',
      description:
        'Explore live full-stack applications by Rumen Terziev: a multi-currency converter and an AI chat assistant, built with Angular and Spring Boot.',
      path: '/applications',
    });
  }

  readonly apps: AppCard[] = [
    {
      route: 'converter',
      icon: 'currency_exchange',
      tag: 'Finance',
      title: 'Currency converter',
      description: 'Convert currencies using BNB rates and view your conversion history.',
      requiresAuth: false,
    },
    {
      route: 'chat-ai',
      icon: 'smart_toy',
      tag: 'AI',
      title: 'AI assistant',
      description: 'Chat with the assistant to ask questions and explore ideas.',
      requiresAuth: true,
    },
  ];
}
