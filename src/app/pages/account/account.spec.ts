import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { Account } from './account';

describe('Account', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isLoading$: of(false),
            isAuthenticated$: of(false),
            user$: of(null),
            error$: of(null),
            loginWithRedirect: () => of(undefined),
            logout: () => of(undefined),
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

  it('links the account page to the current-user profile preview', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    const profileLink = fixture.nativeElement.querySelector(
      'a[routerLink="/profile/me"]',
    ) as HTMLAnchorElement;

    expect(profileLink?.getAttribute('href')).toBe('/profile/me');
  });
});
