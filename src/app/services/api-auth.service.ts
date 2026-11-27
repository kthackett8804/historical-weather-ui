import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
  RegisterResponse,
} from '../models';

import { ApiService } from './api.service';
import { ApiTokenStore } from './api-token.store';
import { TokenExpirationService } from './token-expiration.service';

export interface AppUser {
  sub: string;
  user_id: string;
  username: string;
  email?: string;
  role: 'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
  private readonly api = inject(ApiService);
  private readonly auth0 = inject(Auth0Service);
  private readonly tokenStore = inject(ApiTokenStore);
  private readonly expiration = inject(TokenExpirationService);

  private session = new BehaviorSubject<LoginResponse | null>(null);
  private loading = new BehaviorSubject(false);
  private error = new BehaviorSubject<string | null>(null);

  readonly session$ = this.session.asObservable();

  readonly isLoading$ = combineLatest([
    this.auth0.isLoading$,
    this.loading.asObservable(),
  ]).pipe(map(([auth0Loading, apiLoading]) => auth0Loading || apiLoading));

  readonly loading$ = this.isLoading$;

  readonly isAuthenticated$ = this.session$.pipe(
    map((session) => session !== null),
    distinctUntilChanged(),
  );

  readonly isAdmin$ = this.session$.pipe(
    map((session) => session?.role === 'admin'),
    distinctUntilChanged(),
  );

  readonly user$ = this.session$.pipe(
    map((session) => {
      if (!session) return null;

      return {
        sub: session.user_id,
        user_id: session.user_id,
        username: session.username,
        email: session.email,
        role: session.role,
      };
    }),
  );

  readonly error$ = this.error.asObservable();

  get isAuthenticated(): boolean {
    return this.session.value !== null;
  }

  get isAdmin(): boolean {
    return this.session.value?.role === 'admin';
  }

  get user(): AppUser | null {
    const session = this.session.value;

    if (!session) return null;

    return {
      sub: session.user_id,
      user_id: session.user_id,
      username: session.username,
      email: session.email,
      role: session.role,
    };
  }

  get currentSession(): LoginResponse | null {
    return this.session.value;
  }

  hasRole(role: 'user' | 'admin'): boolean {
    return this.session.value?.role === role;
  }

  canAccess(requiredRole?: 'user' | 'admin'): boolean {
    if (!this.isAuthenticated) return false;
    if (requiredRole === 'admin') return this.isAdmin;

    return true;
  }

  constructor() {
    combineLatest([
      this.auth0.isAuthenticated$,
      this.auth0.idTokenClaims$,
    ])
      .pipe(
        filter(([authenticated, claims]) => authenticated && !!claims?.__raw),
        take(1),
        switchMap(([, claims]) => this.loginWithAuth0(claims!.__raw)),
        catchError(() => throwError(() => new Error('Auth0 login failed'))),
      )
      .subscribe({
        error: () => this.error.next('Auth0 login failed'),
      });
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.track(this.api.register(request));
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.track(
      this.api.login(request).pipe(
        tap((session) => this.setSession(session)),
      ),
    );
  }

  loginWithAuth0(token: string): Observable<LoginResponse> {
    return this.track(
      this.api.loginWithAuth0(token).pipe(
        tap((session) => this.setSession(session)),
      ),
    );
  }

  startAuth0Login(): void {
    this.auth0.loginWithRedirect();
  }

  startAuth0Signup(): void {
    this.auth0.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    });
  }

  logout(): Observable<MessageResponse> {
    return this.track(
      this.api.logout().pipe(
        finalize(() => {
          this.clearSession();

          this.auth0.isAuthenticated$.pipe(take(1)).subscribe((authenticated) => {
            if (authenticated) {
              this.auth0.logout({
                logoutParams: { returnTo: window.location.origin },
              });
            }
          });
        }),
      ),
    );
  }

  renewAuth0Session(): Observable<LoginResponse> {
    return this.auth0.idTokenClaims$.pipe(
      take(1),
      switchMap((claims) => {
        if (!claims?.__raw) {
          return throwError(() => new Error('No Auth0 token available'));
        }

        return this.loginWithAuth0(claims.__raw);
      }),
    );
  }

  clearSession(): void {
    this.session.next(null);
    this.tokenStore.clear();
    this.expiration.setToken(null);
  }

  private setSession(session: LoginResponse): void {
    this.session.next(session);
    this.tokenStore.setToken(session.token);
    this.expiration.setToken(session.token);
  }

  private track<T>(request: Observable<T>): Observable<T> {
    this.loading.next(true);
    this.error.next(null);

    return request.pipe(
      catchError((error: unknown) => {
        const message =
          error instanceof HttpErrorResponse
            ? error.error?.message
            : undefined;

        this.error.next(message ?? 'The authentication request failed.');

        return throwError(() => error);
      }),
      finalize(() => this.loading.next(false)),
    );
  }
}