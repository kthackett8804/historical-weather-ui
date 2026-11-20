import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppShell } from './app-shell';

@Component({
  standalone: true,
  template: '',
})
class TestRoute {}

describe('AppShell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShell],
      providers: [provideRouter([{ path: '**', component: TestRoute }])],
    }).compileComponents();
  });

  it('links all primary navigation items to their approved routes', () => {
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    const links = Array.from(
      fixture.nativeElement.querySelectorAll('nav[aria-label="Main navigation"] a'),
    ) as HTMLAnchorElement[];

    expect(links.map((link) => [link.textContent?.trim(), link.getAttribute('href')])).toEqual([
      ['Dashboard', '/'],
      ['Weather', '/weather'],
      ['Analytics', '/analytics'],
      ['My Weather', '/favourites'],
      ['Compare', '/comparison'],
      ['Reviews', '/reviews'],
      ['My Account', '/profile/preview'],
      ['Admin', '/admin/users'],
    ]);
  });

  it('toggles the mobile navigation expanded state', () => {
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();

    const menuButton = fixture.nativeElement.querySelector(
      'button[aria-controls="primary-navigation"]',
    ) as HTMLButtonElement;
    const navigation = fixture.nativeElement.querySelector('#primary-navigation') as HTMLElement;

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(navigation.classList.contains('is-open')).toBe(false);
    menuButton.click();
    fixture.detectChanges();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(navigation.classList.contains('is-open')).toBe(true);
    menuButton.click();
    fixture.detectChanges();
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(navigation.classList.contains('is-open')).toBe(false);
  });

  it('marks the active route in the primary navigation', async () => {
    const fixture = TestBed.createComponent(AppShell);
    const router = TestBed.inject(Router);

    fixture.detectChanges();
    await router.navigateByUrl('/weather');
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll(
      'nav[aria-label="Main navigation"] a',
    ) as NodeListOf<HTMLAnchorElement>;
    const weatherLink = Array.from(links).find((link) => link.textContent?.trim() === 'Weather');

    expect(weatherLink?.getAttribute('aria-current')).toBe('page');
  });
});
