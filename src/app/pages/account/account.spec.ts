import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Account } from './account';

describe('Account', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the login form by default and switches to registration', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#login-panel form')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#register-panel form')).toBeNull();

    const registerTab = fixture.nativeElement.querySelector('#register-tab') as HTMLButtonElement;
    registerTab.click();
    fixture.detectChanges();

    expect(registerTab.getAttribute('aria-selected')).toBe('true');
    expect(fixture.nativeElement.querySelector('#register-panel form')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#login-panel form')).toBeNull();
  });

  it('supports arrow-key navigation between account tabs', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    const loginTab = fixture.nativeElement.querySelector('#login-tab') as HTMLButtonElement;
    loginTab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#register-tab').getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(fixture.nativeElement.querySelector('#register-tab')).toBe(
      fixture.nativeElement.ownerDocument.activeElement,
    );
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
