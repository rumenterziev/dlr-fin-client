import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth';

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
