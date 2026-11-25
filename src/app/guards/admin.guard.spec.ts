import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { ApiAuthService } from '../services/api-auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  it('allows an authenticated admin', () => {
    const auth = {
      loading$: of(false),
      isAuthenticated: true,
      user: { role: 'admin' },
    } as unknown as ApiAuthService;
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    });

    let result: unknown;
    TestBed.runInInjectionContext(() => {
      result = adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    });

    expect(result).not.toBe(false);
  });

  it('redirects a non-admin user home', () => {
    const navigate = vi.fn(() => Promise.resolve(true));
    const auth = {
      loading$: of(false),
      isAuthenticated: true,
      user: { role: 'user' },
    } as unknown as ApiAuthService;
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiAuthService, useValue: auth },
        { provide: Router, useValue: { navigate } },
      ],
    });

    TestBed.runInInjectionContext(() => {
      const result = adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe();
      }
    });

    expect(navigate).toHaveBeenCalledWith(['/']);
  });
});
