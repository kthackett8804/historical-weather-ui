import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Login } from '../login/login';

@Component({
  selector: 'app-account',
  imports: [Login, RouterLink],
  template: `
    <section aria-labelledby="account-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="account-title">My Account</h1>
        <p>Sign in or create an account through Auth0.</p>
        <a class="profile-link" routerLink="/profile/me">View profile preview</a>
      </header>

      <div class="account-panel">
        <app-login [embedded]="true" />
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
    .page-heading > p:last-child {
      margin-block: 0;
      color: #536b87;
    }
    .profile-link {
      display: inline-block;
      margin-top: 0.75rem;
      color: #1d67c8;
      font-weight: 700;
    }
    .account-panel {
      max-width: 32rem;
      padding: 1rem;
      border: 1px solid #d7e0ed;
      background: white;
    }
  `,
})
export class Account {
}
