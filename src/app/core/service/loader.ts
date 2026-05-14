import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  readonly loading = signal(false);

  private loaderTimeout: ReturnType<typeof setTimeout> | undefined;

  show(delay: number = 200): void {
    clearTimeout(this.loaderTimeout);
    this.loaderTimeout = setTimeout(() => {
      this.loading.set(true);
    }, delay);
  }

  hide(): void {
    clearTimeout(this.loaderTimeout);
    this.loading.set(false);
  }
}
