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

  //  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const token = this.tokenStore.currentToken;
    return next.handle(
      token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req,
    );
  }

}
