import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, of } from 'rxjs';
import { AuthService } from '../service/auth';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const denyRedirect = () =>
    router.createUrlTree(['/login'], {
      queryParams: { authRequired: 'true', returnUrl: state.url },
    });

  if (authService.user()) {
    return of(true);
  }

  return authService.autoLoginFetch().pipe(
    map((user) => {
      if (user) {
        authService.user.set(user);
        return true;
      }
      return denyRedirect();
    }),
  );
};
