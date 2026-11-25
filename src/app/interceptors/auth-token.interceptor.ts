import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiTokenStore } from '../services/api-token.store';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private readonly tokenStore = inject(ApiTokenStore);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.headers.has('Authorization') || !this.isProtectedApiRequest(req.url)) {
      return next.handle(req);
    }

    const token = this.tokenStore.currentToken;
    return next.handle(
      token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req,
    );
  }

  private isProtectedApiRequest(url: string): boolean {
    const path = url.split('?')[0];
    if (!path) return false;

    const isApiRequest = path.startsWith('/api/')
      ? true
      : this.isSameOriginApiRequest(url);
    if (!isApiRequest) return false;

    return !/\/api\/v\d+(?:\.\d+)*\/(?:registration|login|auth0-login)\/?$/.test(path);
  }

  private isSameOriginApiRequest(url: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const requestUrl = new URL(url, window.location.origin);
      return requestUrl.origin === window.location.origin && requestUrl.pathname.startsWith('/api/');
    } catch {
      return false;
    }
  }
}
