import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

export interface AppUser extends Partial<User> {
  role?: 'user' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AppAuthService {
  private readonly auth0 = inject(Auth0Service);

  readonly loading$: Observable<boolean> = this.auth0.isLoading$;
  readonly isAuthenticated$: Observable<boolean> = this.auth0.isAuthenticated$;
  readonly user$: Observable<AppUser | null | undefined> = this.auth0.user$ as Observable<
    AppUser | null | undefined
  >;

  isAuthenticated = false;
  user: AppUser | null = null;

  constructor() {
    this.auth0.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });
    this.auth0.user$.subscribe((user) => {
      const appUser = user as (AppUser & Record<string, unknown>) | null | undefined;
      if (!appUser) {
        this.user = null;
        return;
      }

      const roles = appUser['https://weather-atlas/roles'] as string[] | undefined;
      const claimRole = appUser['role'] as 'user' | 'admin' | undefined;
      this.user = {
        ...appUser,
        role: claimRole ?? (roles?.includes('admin') ? 'admin' : 'user'),
      };
    });
  }
}
