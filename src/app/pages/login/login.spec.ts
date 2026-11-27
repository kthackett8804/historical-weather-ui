import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../../services/api-auth.service';
import { Login } from './login';

describe('Login', () => {
  const auth = {

    isLoading$: of(false),
    isAuthenticated$: of(false),
    user$: of(null),
    error$: of(null),

    login: vi.fn(() => of({
      token: 'application-jwt',
      username: 'weather-user',
      user_id: 'user-id',
      role: 'user' as const,
    })),

    register: vi.fn(() => of({
      message: 'registered',
      user_id: 'user-id',
      role: 'user' as const,
    })),

    startAuth0Login: vi.fn(),
    startAuth0Signup: vi.fn(),
    logout: vi.fn(() => of({ message: 'Logged out' })),
  };

  beforeEach(async () => {
    auth.login.mockClear();
    auth.register.mockClear();
    auth.startAuth0Login.mockClear();
    auth.startAuth0Signup.mockClear();
    
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => 'true' } } },
        },
        { provide: ApiAuthService, useValue: auth },
      ],
    }).compileComponents();
  });

  it('provides login and signup buttons through the Auth0 SDK', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-auth-login]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-auth-signup]')).toBeTruthy();
  });

  it('submits username and password to the backend authentication service', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const username = fixture.nativeElement.querySelector('#username') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    username.value = 'weather-user';
    username.dispatchEvent(new Event('input'));
    password.value = 'secret';
    password.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    expect(auth.login).toHaveBeenCalledWith({
      username: 'weather-user',
      password: 'secret',
    });
  });

  it('registers email/password accounts without navigating to a separate page', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-show-register]') as HTMLButtonElement).click();
    fixture.detectChanges();

    const values: Record<string, string> = {
      '#register-username': 'weather-user',
      '#register-email': 'weather@example.com',
      '#register-password': 'Weather@123',
    };
    for (const [selector, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(auth.register).toHaveBeenCalledWith({
      username: 'weather-user',
      email: 'weather@example.com',
      password: 'Weather@123',
    });
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Account created',
    );
    expect(fixture.nativeElement.querySelector('a[href="/register"]')).toBeNull();
  });

  it('shows an authentication warning when redirected from a protected page', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Sign in to continue to the requested page.',
    );
  });

});
