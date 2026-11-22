import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink],
  host: {
    '[class.embedded]': 'embedded',
  },
  template: `
    <div class="page" [attr.role]="embedded ? null : 'main'">
      <section aria-labelledby="login-title">
        @if (!embedded) {
          <a class="brand" routerLink="/" aria-label="Weather Atlas home">☁</a>
        }
        <h1 id="login-title">Weather Atlas</h1>
        <p>Welcome back</p>
        @if (auth.isLoading$ | async) {
          <p role="status">Loading authentication...</p>
        } @else if ((auth.isAuthenticated$ | async) && (auth.user$ | async); as user) {
          <p>Logged in as {{ user.email }}</p>
          <button type="button" (click)="logout()">Logout</button>
        } @else {
          @if (auth.error$ | async; as error) {
            <p class="error" role="alert">{{ error.message }}</p>
          }
          <button data-auth-login type="button" (click)="login()">Log In</button>
          <button data-auth-signup type="button" (click)="signUp()">Sign Up</button>
        }
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: #edf3fc;
      color: #172b46;
      font-family: Arial, sans-serif;
    }
    :host(.embedded) {
      min-height: 0;
      background: transparent;
      color: #172b46;
      font-family: inherit;
    }
    .page {
      display: grid;
      min-height: 100vh;
      place-items: center;
      padding: 1rem;
    }
    :host(.embedded) .page {
      min-height: 0;
      padding: 0;
    }
    section {
      width: min(100%, 22rem);
      padding: 2rem;
      border: 1px solid #d7e0ed;
      border-radius: 0.5rem;
      background: white;
      text-align: center;
    }
    .brand {
      color: #1d67c8;
      font-size: 2.5rem;
      text-decoration: none;
    }
    h1 {
      margin: 0.25rem 0;
      font-size: 1.5rem;
    }
    section > p {
      color: #475b73;
    }
    section > button {
      display: block;
      width: 100%;
      margin-top: 0.75rem;
    }
    button:focus-visible,
    a:focus-visible {
      outline: 3px solid #1d67c8;
      outline-offset: 2px;
    }
    .error {
      margin: 0;
      color: #a32121;
      font-size: 0.9rem;
    }
    button {
      min-height: 2.75rem;
      margin-top: 0.5rem;
      border: 0;
      border-radius: 0.25rem;
      color: white;
      background: #1d67c8;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    button:hover {
      background: #164f9a;
    }
  `,
})
export class Login {
  @Input() embedded = false;
  protected readonly auth = inject(AuthService);

  protected login(): void {
    this.auth.loginWithRedirect();
  }

  protected signUp(): void {
    this.auth.loginWithRedirect({
      authorizationParams: { screen_hint: 'signup' },
    });
  }

  protected logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
}
