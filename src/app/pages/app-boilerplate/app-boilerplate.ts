import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header>
      <a class="brand" routerLink="/" aria-label="Weather Atlas dashboard">☁ Weather Atlas</a>
      <nav class="quick-links" aria-label="Quick links">
        <a routerLink="/weather">Explore</a>
        <a routerLink="/analytics">Analyse</a>
        <a routerLink="/comparison">Compare</a>
      </nav>
      @if (!(auth.isLoading$ | async)) {
        @if (auth.isAuthenticated$ | async) {
          <button type="button" class="auth-button" (click)="logout()">Log out</button>
        } @else {
          <a class="auth-button" routerLink="/account">Log in</a>
        }
      }
      <button
        class="menu-toggle"
        type="button"
        aria-controls="primary-navigation"
        [attr.aria-expanded]="menuOpen"
        [attr.aria-label]="menuOpen ? 'Close navigation' : 'Open navigation'"
        (click)="menuOpen = !menuOpen"
      >
        <span aria-hidden="true">{{ menuOpen ? '×' : '☰' }}</span>
      </button>
    </header>
    <div class="layout">
      <aside id="primary-navigation" [class.open]="menuOpen">
        <nav aria-label="Main navigation">
          @for (link of navLinks; track link.path) {
            <a
              [routerLink]="link.path"
              routerLinkActive="active"
              ariaCurrentWhenActive="page"
              [routerLinkActiveOptions]="{ exact: link.exact }"
              (click)="menuOpen = false"
              >{{ link.label }}</a
            >
          }
        </nav>
      </aside>
      <main><router-outlet /></main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      color: #172b46;
      background: #f3f6fb;
      font-family: Arial, sans-serif;
    }
    header {
      display: flex;
      min-height: 3.75rem;
      align-items: center;
      gap: 1.5rem;
      padding: 0.5rem 1.25rem;
      color: white;
      background: #142b48;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    .brand {
      font-size: 1.2rem;
      font-weight: 700;
    }
    .quick-links {
      display: flex;
      gap: 1.25rem;
      margin-left: auto;
    }
    .menu-toggle {
      display: none;
    }
    .auth-button {
      min-height: 2.75rem;
      padding: 0.65rem 0.75rem;
      border: 1px solid #a9bdd5;
      border-radius: 0.25rem;
      color: white;
      background: transparent;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .layout {
      display: grid;
      min-height: calc(100vh - 3.75rem);
      grid-template-columns: 14rem minmax(0, 1fr);
    }
    aside {
      padding: 1rem 0.75rem;
      color: white;
      background: #142b48;
    }
    aside nav {
      display: grid;
      gap: 0.25rem;
    }
    aside a {
      padding: 0.75rem;
      border-radius: 0.25rem;
    }
    aside a:hover {
      background: #25466f;
    }
    aside a.active {
      background: #1d67c8;
      font-weight: 700;
    }
    main {
      min-width: 0;
      padding: clamp(1rem, 2.5vw, 2rem);
    }
    a:focus-visible,
    button:focus-visible {
      outline: 3px solid #ffd66b;
      outline-offset: 3px;
    }
    @media (max-width: 48rem) {
      .layout {
        display: block;
      }
      .menu-toggle {
        display: block;
        min-width: 2.75rem;
        min-height: 2.75rem;
        margin-left: auto;
        color: white;
        background: transparent;
        border: 1px solid #6f89a8;
        border-radius: 0.25rem;
      }
      aside {
        position: fixed;
        z-index: 3;
        inset: 3.75rem auto 0 0;
        width: min(18rem, 86vw);
        visibility: hidden;
        transform: translateX(-100%);
        transition: transform 160ms ease;
      }
      aside.open {
        visibility: visible;
        transform: translateX(0);
      }
      main {
        padding: 1rem;
      }
    }
    @media (max-width: 30rem) {
      .quick-links {
        display: none;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      aside {
        transition: none;
      }
    }
  `,
})
export class AppShell {
  protected readonly auth = inject(AuthService);
  protected menuOpen = false;
  protected readonly navLinks = [
    { label: 'Dashboard', path: '/', exact: true },
    { label: 'Weather', path: '/weather', exact: false },
    { label: 'Analytics', path: '/analytics', exact: false },
    { label: 'My Weather', path: '/favourites', exact: false },
    { label: 'Compare', path: '/comparison', exact: false },
    { label: 'Reviews', path: '/reviews', exact: false },
    { label: 'My Account', path: '/account', exact: false },
    { label: 'Admin', path: '/admin/users', exact: false },
  ];

  protected logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
}
