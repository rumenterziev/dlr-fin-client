import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface PolicyVersionResponse {
  policyVersion: string;
}

@Injectable({ providedIn: 'root' })
export class PrivacyService {
  private readonly http = inject(HttpClient);

  /** Latest policy version known to the server. Populated by `loadPolicyVersion()`. */
  readonly policyVersion = signal<string | null>(null);

  private readonly xhrHeaders = new HttpHeaders({
    'X-Requested-With': 'XMLHttpRequest',
  });

  /**
   * Fetch the current policy version from the backend.
   * Returns null on failure (callers fall back to cached/local value).
   */
  loadPolicyVersion(): Observable<string | null> {
    return this.http
      .get<PolicyVersionResponse>('/api/v1/privacy/policy-version', { withCredentials: true })
      .pipe(
        tap((res) => this.policyVersion.set(res.policyVersion)),
        map((res) => res.policyVersion as string | null),
        catchError(() => of<string | null>(null)),
      );
  }

  /**
   * Stash consent on the backend session BEFORE redirecting to Google.
   * Returns a promise so callers can `await` it before navigating.
   */
  async postConsent(policyVersion: string): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(
        '/api/v1/privacy/consent',
        { policyVersion },
        { headers: this.xhrHeaders, withCredentials: true },
      ),
    );
  }

  /** Full GDPR data export for the signed-in user. */
  exportMyData(): Observable<unknown> {
    return this.http.get('/api/v1/privacy/profile/export', { withCredentials: true });
  }

  /** Account erasure (GDPR Art. 17). */
  deleteMyAccount(): Observable<void> {
    return this.http.delete<void>('/api/v1/privacy/profile', { withCredentials: true });
  }
}
