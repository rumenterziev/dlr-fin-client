import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/service/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = computed(() => !!this.authService.user());

  readonly techStack = [
    { name: 'Angular', icon: 'web' },
    { name: 'TypeScript', icon: 'code' },
    { name: 'Spring Boot', icon: 'eco' },
    { name: 'Java', icon: 'coffee' },
    { name: 'MySQL', icon: 'storage' },
    { name: 'Azure', icon: 'cloud' },
  ];

  goToChat(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/applications/chat-ai']);
    } else {
      this.router.navigate(['/login'], {
        queryParams: { authRequired: 'true', returnUrl: '/applications/chat-ai' },
      });
    }
  }
}
