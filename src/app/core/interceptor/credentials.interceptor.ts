import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Ensures every HTTP request to our API:
 *   1. Sends and accepts cookies (JSESSIONID), and
 *   2. Carries the X-Requested-With header so Spring Security's
 *      OAuth2 entry point returns 401 instead of redirecting to Google.
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const cloned = req.clone({
    withCredentials: true,
    setHeaders: req.headers.has('X-Requested-With') ? {} : { 'X-Requested-With': 'XMLHttpRequest' },
  });

  return next(cloned);
};
