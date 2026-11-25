import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { ApiAuthService } from '../services/api-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(ApiAuthService);
  const router = inject(Router);

  return authService.loading$.pipe(
    take(1),
    map((loading) => {
      if (loading) {
        return false;
      }
      if (authService.isAuthenticated) {
        return true;
      }
      const url = typeof state.url === 'string' ? state.url : '';
      if (url.split('?')[0].endsWith('/favourites') ||
          url.split('?')[0].endsWith('/comparison')) {
        if (route.queryParams['authRequired'] === 'true') {
          return true;
        }
        return router.createUrlTree([url.split('?')[0]], {
          queryParams: { authRequired: 'true' },
        });
      }
      void router.navigate(['/login'], {
        queryParams: { authRequired: 'true' },
      });
      return false;
    }),
  );
};
