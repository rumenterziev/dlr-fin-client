import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/service/auth';
import { SeoService } from '../../core/service/seo';

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

  constructor() {
    inject(SeoService).update({
      title: 'Rumen Terziev — Software Engineer',
      description:
        'Portfolio of Rumen Terziev — full-stack software engineer building polished web applications with Angular, Java and Spring Boot. Try the AI chat assistant and currency converter.',
      path: '/home',
    });
  }

  readonly isAuthenticated = computed(() => !!this.authService.user());

  readonly techStack = [
    { name: 'Angular', icon: 'web' },
    { name: 'TypeScript', icon: 'code' },
    { name: 'Spring Boot', icon: 'eco' },
    { name: 'Java', icon: 'coffee' },
    { name: 'Python', icon: 'terminal' },
    { name: 'MySQL', icon: 'storage' },
    { name: 'Google Cloud', icon: 'cloud' },
    { name: 'Azure', icon: 'cloud_queue' },
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
