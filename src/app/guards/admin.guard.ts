import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ApiAuthService } from '../services/api-auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(ApiAuthService);
  const router = inject(Router);

  return authService.loading$.pipe(
    take(1),
    map((loading) => {
      if (loading) {
        return false;
      }
      if (authService.isAuthenticated && authService.user?.role === 'admin') {
        return true;
      }
      void router.navigate(['/']);
      return false;
    }),
  );
};
