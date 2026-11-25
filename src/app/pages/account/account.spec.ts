import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ApiAuthService } from '../../services/api-auth.service';
import { Account } from './account';

describe('Account', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        provideRouter([]),
        {
          provide: ApiAuthService,
          useValue: {
            isLoading$: of(false),
            isAuthenticated$: of(false),
            user$: of(null),
            error$: of(null),
            register: () => of({ message: 'registered', user_id: 'user-id', role: 'user' as const }),
            login: () => of({
              token: 'application-jwt',
              username: 'weather-user',
              user_id: 'user-id',
              role: 'user' as const,
            }),
            startAuth0Login: () => undefined,
            startAuth0Signup: () => undefined,
            logout: () => of({ message: 'Logged out' }),
          },
        },
      ],
    }).compileComponents();
  });

  it('shows the Auth0 login and signup controls', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-auth-login]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-auth-signup]')).toBeTruthy();
  });

  it('keeps email/password account creation on the account page', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-show-register]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/register"]')).toBeNull();
  });

  it('links the account page to the current-user profile', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    const profileLink = fixture.nativeElement.querySelector(
      'a[routerLink="/profile/me"]',
    ) as HTMLAnchorElement;

    expect(profileLink?.getAttribute('href')).toBe('/profile/me');
  });
});
