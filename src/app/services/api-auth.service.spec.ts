import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from './api-auth.service';
import { ApiTokenStore } from './api-token.store';
import { AuthTokenInterceptor } from '../interceptors/auth-token.interceptor';

describe('ApiAuthService', () => {
  let service: ApiAuthService;
  let tokenStore: ApiTokenStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiAuthService,
        ApiTokenStore,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        {
          provide: AuthService,
          useValue: {
            isLoading$: of(false),
            isAuthenticated$: of(false),
            idTokenClaims$: of(null),
            loginWithRedirect: vi.fn(),
            logout: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(ApiAuthService);
    tokenStore = TestBed.inject(ApiTokenStore);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('stores the backend JWT and user returned by password login', () => {
    service.login({ username: 'weather-user', password: 'secret' }).subscribe();
    const request = httpTestingController.expectOne('/api/v1.0/login');
    expect(request.request.method).toBe('POST');
    request.flush({
      token: 'application-jwt',
      username: 'weather-user',
      user_id: 'user-id',
      role: 'user',
      email: 'weather@example.com',
    });

    expect(tokenStore.currentToken).toBe('application-jwt');
    expect(service.currentSession?.user_id).toBe('user-id');
  });

  it('clears the in-memory session when backend logout fails', () => {
    service.login({ username: 'weather-user', password: 'secret' }).subscribe();
    httpTestingController.expectOne('/api/v1.0/login').flush({
      token: 'application-jwt',
      username: 'weather-user',
      user_id: 'user-id',
      role: 'user',
    });

    service.logout().subscribe({ error: () => undefined });
    const request = httpTestingController.expectOne('/api/v1.0/logout');
    expect(request.request.headers.get('Authorization')).toBe('Bearer application-jwt');
    request.flush({ message: 'Expired' }, { status: 401, statusText: 'Unauthorized' });

    expect(tokenStore.currentToken).toBeNull();
    expect(service.currentSession).toBeNull();
  });
});
