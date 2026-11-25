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

  it('offers a button that takes users to login', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[data-login]')).toBeTruthy();
  });

  it('links to the current-user profile', () => {
    const fixture = TestBed.createComponent(Account);
    fixture.detectChanges();

    const profileLink = fixture.nativeElement.querySelector(
      'a[routerLink="/profile/me"]',
    ) as HTMLAnchorElement;

    expect(profileLink?.getAttribute('href')).toBe('/profile/me');
  });
});
