import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders routed pages without the Angular starter placeholder', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/weather/search');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-shell main h1')?.textContent).toContain('Weather Search');
    expect(compiled.textContent).not.toContain('Hello, historical-weather-ui');
  });

  it('opens the login and registration tabs from My Account', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/account');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-shell main h1')?.textContent).toContain('My Account');
    expect(
      compiled.querySelector('nav[aria-label="Main navigation"] a[aria-current="page"]')
        ?.textContent,
    ).toContain('My Account');
    expect(compiled.querySelector('#login-panel form')).toBeTruthy();

    (compiled.querySelector('#register-tab') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('#register-panel form')).toBeTruthy();
  });
});
