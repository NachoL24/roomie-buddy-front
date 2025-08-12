import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalUserService } from '@application/use-cases';
import { AuthService } from '@auth0/auth0-angular';
import { filter, take, switchMap, map } from 'rxjs';

export const homepageGuard: CanActivateFn = () => {
  const userService = inject(GlobalUserService);
  const auth0 = inject(AuthService);
  const router = inject(Router);

  return auth0.isLoading$.pipe(
      filter(loading => !loading), // Esperar a que Auth0 termine de cargar
      take(1),
      switchMap(() =>
        auth0.isAuthenticated$.pipe(
          take(1),
          map(isAuthenticated => {
            if (isAuthenticated) {
              router.navigate(['/dashboard']);
              return false;
            }
            return true;
          })
        )
      )
    );
};
