import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { Login } from './login';

describe('Login', () => {
  const auth = {
    isLoading$: of(false),
    isAuthenticated$: of(false),
    user$: of(null),
    error$: of(null),
    loginWithRedirect: () => of(undefined),
    logout: () => of(undefined),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => 'authenticated-user-required' } } },
        },
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();
  });

  it('provides login and signup buttons through the Auth0 SDK', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-auth-login]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-auth-signup]')).toBeTruthy();
  });

  it('shows an authentication warning when redirected from a protected page', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'authenticated',
    );
  });

  it('omits standalone account navigation when embedded', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentRef.setInput('embedded', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('main')).toBeNull();
  });
});
