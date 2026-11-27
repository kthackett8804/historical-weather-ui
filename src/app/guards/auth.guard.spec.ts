import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../services/api-auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('allows an authenticated user', async () => {
    const auth = { loading$: of(false), isAuthenticated: true } as ApiAuthService;
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        { queryParams: {} } as ActivatedRouteSnapshot,
        { url: '/weather' } as RouterStateSnapshot,
      ),
    );

    expect(await firstValueFrom(result as Observable<boolean>)).toBe(true);
  });

  it('keeps favourites available with an authentication warning', () => {
    const auth = { loading$: of(false), isAuthenticated: false } as ApiAuthService;
    const warningRoute = {};
    const createUrlTree = vi.fn(() => warningRoute);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { createUrlTree } },
      ],
    });

    let result: unknown;
    TestBed.runInInjectionContext(() => {
      const guardResult = authGuard(
        { queryParams: {} } as unknown as ActivatedRouteSnapshot,
        { url: '/favourites' } as RouterStateSnapshot,
      );
      if (typeof guardResult === 'object' && 'subscribe' in guardResult) {
        guardResult.subscribe((value) => {
          result = value;
        });
      }
    });

    expect(createUrlTree).toHaveBeenCalledWith(['/favourites'], {
      queryParams: { authRequired: 'true' },
    });
    expect(result).toBe(warningRoute);
  });

  it('redirects an unauthenticated user to login', async () => {
    const auth = { loading$: of(false), isAuthenticated: false } as ApiAuthService;
    const loginRoute = {};
    const createUrlTree = vi.fn(() => loginRoute);
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { createUrlTree } },
      ],
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        { queryParams: {} } as ActivatedRouteSnapshot,
        { url: '/profile/user-1' } as RouterStateSnapshot,
      ),
    );

    expect(await firstValueFrom(result as Observable<unknown>)).toBe(loginRoute);
    expect(createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { authRequired: 'true' },
    });
  });
});
