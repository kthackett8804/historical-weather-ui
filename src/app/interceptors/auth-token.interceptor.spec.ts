import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { AuthTokenInterceptor } from './auth-token.interceptor';

describe('AuthTokenInterceptor', () => {
  it('adds a bearer token to same-origin API requests', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
        {
          provide: AuthService,
          useValue: {
            isAuthenticated$: of(true),
            getAccessTokenSilently: () => of('test-token'),
          },
        },
      ],
    });

    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    http.get('/api/weather').subscribe();

    const request = controller.expectOne('/api/weather');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({});
  });
});
