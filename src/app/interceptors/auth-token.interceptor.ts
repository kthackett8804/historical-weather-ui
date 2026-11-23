import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private readonly auth = inject(AuthService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.headers.has('Authorization') || !this.isProtectedRequest(req.url)) {
      return next.handle(req);
    }

    return this.auth.isAuthenticated$.pipe(
      take(1),
      switchMap((authenticated) =>
        authenticated
          ? this.auth.getAccessTokenSilently().pipe(
              switchMap((token) =>
                next.handle(
                  token
                    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                    : req,
                ),
              ),
            )
          : next.handle(req),
      ),
    );
  }

  private isProtectedRequest(url: string): boolean {
    if (url.startsWith('/api/') || url.includes('/api/')) {
      return true;
    }
    try {
      return new URL(url, window.location.origin).origin === window.location.origin;
    } catch {
      return false;
    }
  }
}
