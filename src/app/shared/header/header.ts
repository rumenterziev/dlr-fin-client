import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../core/service/theme';
import { AuthService } from '../../core/service/auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly isAuthenticated = computed(() => !!this.auth.user());
  readonly username = computed(() => this.auth.user()?.username ?? null);

  readonly mobileNavOpen = signal(false);
  readonly scrolled = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }

  toggleMobileNav(): void {
    const next = !this.mobileNavOpen();
    this.mobileNavOpen.set(next);
    document.body.style.overflow = next ? 'hidden' : '';
  }

  closeMobileNav(): void {
    if (this.mobileNavOpen()) {
      this.mobileNavOpen.set(false);
      document.body.style.overflow = '';
    }
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.closeMobileNav();
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (e) => console.error(e),
    });
  }
}
