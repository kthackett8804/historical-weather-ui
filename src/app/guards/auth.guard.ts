
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
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

      const url = state.url.split('?')[0];
      const isProtectedPage = url.endsWith('/favourites') || url.endsWith('/comparison');

      if (isProtectedPage && route.queryParams['authRequired'] === 'true') {
        return true;
      }

      if (isProtectedPage) {
        return router.createUrlTree([url], {
          queryParams: { authRequired: 'true' },
        });
      }

      return router.createUrlTree(['/login'], {
        queryParams: { authRequired: 'true' },
      });
    }),
  );
};
