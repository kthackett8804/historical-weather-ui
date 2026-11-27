import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { ApiAuthService } from './services/api-auth.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        {
          provide: ApiAuthService,
          useValue: {
            isLoading$: of(false),
            isAuthenticated$: of(false),
            session$: of(null),
            user$: of(null),
            error$: of(null),
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
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders routed pages', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/weather/search');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-shell main h1')?.textContent).toContain('Weather Search');
    expect(compiled.textContent).not.toContain('Hello, historical-weather-ui');
  });

  it('shows a sign-in button on the account page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/account');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-shell main h1')?.textContent).toContain('My Account');
    const signInButton = compiled.querySelector('app-shell main button[data-login]') as HTMLButtonElement;
    expect(signInButton?.textContent).toContain('Sign in');

    signInButton.click();
    await fixture.whenStable();
    expect(router.url).toBe('/login');
  });

  it('shows the authentication controls on the login page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/login');
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-auth-login]')).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).querySelector('[data-auth-signup]')).toBeTruthy();
  });
});
