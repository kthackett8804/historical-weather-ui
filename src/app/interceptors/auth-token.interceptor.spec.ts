import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthTokenInterceptor } from './auth-token.interceptor';
import { ApiTokenStore } from '../services/api-token.store';

describe('AuthTokenInterceptor', () => {
  it('adds a bearer token to same-origin API requests', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
      ],
    });
    TestBed.inject(ApiTokenStore).setToken('test-token');

    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    http.get('/api/weather').subscribe();

    const request = controller.expectOne('/api/weather');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-token');
    request.flush({});
  });

  it('does not send the backend JWT to public authentication endpoints', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
      ],
    });
    TestBed.inject(ApiTokenStore).setToken('test-token');

    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    http.post('/api/v1.0/login', {}).subscribe();

    const request = controller.expectOne('/api/v1.0/login');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
