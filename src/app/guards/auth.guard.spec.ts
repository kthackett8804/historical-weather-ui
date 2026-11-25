import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiAuthService } from '../services/api-auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('allows an authenticated user', () => {
    const auth = { loading$: of(false), isAuthenticated: true } as ApiAuthService;
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    });

    let result: unknown;
    TestBed.runInInjectionContext(() => {
      result = authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    });

    expect(result).not.toBe(false);
  });

  it('redirects unauthenticated favourites to login with a warning', () => {
    const auth = { loading$: of(false), isAuthenticated: false } as ApiAuthService;
    const navigate = vi.fn(() => Promise.resolve(true));
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { navigate } },
      ],
    });

    TestBed.runInInjectionContext(() => {
      const result = authGuard(
        { queryParams: {} } as unknown as ActivatedRouteSnapshot,
        { url: '/favourites' } as RouterStateSnapshot,
      );
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe();
      }
    });

    expect(navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { reason: 'authenticated-user-required' },
    });
  });

  it('redirects an unauthenticated user to login', async () => {
    const navigate = vi.fn(() => Promise.resolve(true));
    const auth = { loading$: of(false), isAuthenticated: false } as ApiAuthService;
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { navigate } },
      ],
    });

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe();
      }
    });

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
