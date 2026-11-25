import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="account-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="account-title">My Account</h1>
      </header>

      <div class="account-panel">
        <p>Sign in to access your account and saved weather data.</p>
        <button type="button" data-login routerLink="/login">Sign in</button>
        <a class="profile-link" routerLink="/profile/me">View profile</a>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page-heading {
      margin-bottom: 1.5rem;
    }
    .eyebrow {
      margin: 0 0 0.25rem;
      color: #536b87;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    h1 {
      margin: 0 0 0.5rem;
    }
    .account-panel {
      display: grid;
      justify-items: start;
      gap: 1rem;
      max-width: 32rem;
      padding: 1rem;
      border: 1px solid #d7e0ed;
      background: white;
    }
    p {
      margin: 0;
      color: #536b87;
    }
    button {
      min-height: 2.75rem;
      padding: 0.65rem 0.75rem;
      border: 0;
      border-radius: 0.25rem;
      color: white;
      background: #1d67c8;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .profile-link {
      color: #1d67c8;
      font-weight: 700;
    }
    button:focus-visible,
    a:focus-visible {
      outline: 3px solid #1d67c8;
      outline-offset: 2px;
    }
  `,
})
export class Account {}
