import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COOKIE_BANNER_STORAGE_KEY } from '../../core/config/privacy';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBanner {
  readonly visible = signal(this.shouldShow());

  dismiss(): void {
    try {
      localStorage.setItem(COOKIE_BANNER_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    this.visible.set(false);
  }

  private shouldShow(): boolean {
    try {
      return localStorage.getItem(COOKIE_BANNER_STORAGE_KEY) !== 'true';
    } catch {
      return false;
    }
  }
}
