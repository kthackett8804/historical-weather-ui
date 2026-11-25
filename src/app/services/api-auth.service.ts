import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { LoginRequest, LoginResponse, MessageResponse, RegisterRequest, RegisterResponse } from '../models';
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

function toAppUser(session: LoginResponse | null): AppUser | null {
  if (!session) return null;

  return {
    sub: session.user_id,
    user_id: session.user_id,
    username: session.username,
    email: session.email,
    role: session.role,
  };
}

@Injectable({ providedIn: 'root' })
export class ApiAuthService {
  private readonly api = inject(ApiService);
  private readonly auth0 = inject(Auth0Service);
  private readonly tokenStore = inject(ApiTokenStore);
  private readonly expiration = inject(TokenExpirationService);
  private readonly sessionSubject = new BehaviorSubject<LoginResponse | null>(null);
  private readonly loadingSubject = new BehaviorSubject(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly session$ = this.sessionSubject.asObservable();
  readonly loading$ = combineLatest([
    this.auth0.isLoading$,
    this.loadingSubject.asObservable(),
  ]).pipe(map(([auth0Loading, apiLoading]) => auth0Loading || apiLoading));
  readonly isLoading$ = this.loading$;
  readonly isAuthenticated$ = this.session$.pipe(
    map((session) => session !== null),
    distinctUntilChanged(),
  );
  readonly user$: Observable<AppUser | null> = this.session$.pipe(map(toAppUser));
  readonly error$ = this.errorSubject.asObservable();

  get isAuthenticated(): boolean {
    return this.sessionSubject.value !== null;
  }

  get user(): AppUser | null {
    return toAppUser(this.sessionSubject.value);
  }

  get currentSession(): LoginResponse | null {
    return this.sessionSubject.value;
  }

  constructor() {
    combineLatest([this.auth0.isAuthenticated$, this.auth0.idTokenClaims$])
      .pipe(
        filter(([authenticated, claims]) => authenticated && Boolean(claims?.__raw)),
        take(1),
        map(([, claims]) => claims!.__raw),
        switchMap((idToken) => this.loginWithAuth0(idToken)),
      )
      .subscribe({ error: () => undefined });
  }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.track(this.api.register(request));
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.track(
      this.api.login(request).pipe(tap((session) => this.setSession(session))),
    );
  }

  loginWithAuth0(idToken: string): Observable<LoginResponse> {
    return this.track(
      this.api.loginWithAuth0(idToken).pipe(tap((session) => this.setSession(session))),
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
      switchMap((claims) =>
        claims?.__raw
          ? this.loginWithAuth0(claims.__raw)
          : throwError(() => new Error('No Auth0 ID token is available to renew the API session.')),
      ),
    );
  }

  clearSession(): void {
    this.sessionSubject.next(null);
    this.tokenStore.clear();
    this.expiration.setToken(null);
  }

  private setSession(session: LoginResponse): void {
    this.sessionSubject.next(session);
    this.tokenStore.setToken(session.token);
    this.expiration.setToken(session.token);
  }

  private track<T>(operation: Observable<T>): Observable<T> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    return operation.pipe(
      catchError((error: unknown) => {
        const message = error instanceof HttpErrorResponse ? error.error?.message : undefined;
        this.errorSubject.next(message ?? 'The authentication request failed.');
        return throwError(() => error);
      }),
      finalize(() => this.loadingSubject.next(false)),
    );
  }
}
