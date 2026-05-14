import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/service/auth';
import { Footer } from './shared/footer/footer';
import { Header } from './shared/header/header';
import { Loader } from './shared/loader/loader';
import { CookieBanner } from './shared/cookie-banner/cookie-banner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Loader, CookieBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly authService = inject(AuthService);

  protected readonly title = signal('Rumen Terziev');
  readonly isAuthenticated = computed(() => !!this.authService.user());

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
