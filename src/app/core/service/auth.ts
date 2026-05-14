import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<User | null>(null);
  private tokenExpirationTimer: any;
  private googleAuthUrl = '/api/v1/oauth2/authorization/google';

  constructor(private http: HttpClient) {}

  /**
   * Top-level navigation (NOT fetch) — required for the OAuth redirect chain
   * so the JSESSIONID cookie travels along and the backend can read the
   * consent it stashed via POST /privacy/consent immediately before this call.
   */
  loginWithGoogle(): void {
    window.location.href = this.googleAuthUrl;
  }

  logout() {
    const url = '/api/v1/auth/logout';
    this.user.set(null);
    localStorage.removeItem('userData');
    return this.http.post<void>(url, {}).pipe(catchError(this.handleError));
  }

  autoLogin(): void {
    this.http.get<User>('/api/v1/users/profile').subscribe({
      next: (user) => this.user.set(user ? new User(user.username) : null),
      error: () => this.user.set(null),
    });
  }

  autoLoginFetch(): Observable<User | null> {
    return this.http.get<User>('/api/v1/users/profile').pipe(
      map((user) => (user ? new User(user.username) : null)),
      catchError(() => of(null)),
    );
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout().subscribe();
    }, expirationDuration);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'No connection to server.';
    } else {
      errorMessage = `Server error (${error.status}): ${error.message}`;
    }

    console.error('AuthService error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
