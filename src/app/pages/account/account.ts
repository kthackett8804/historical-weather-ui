import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Login } from '../login/login';
import { Register } from '../register/register';

type AccountTab = 'login' | 'register';

@Component({
  selector: 'app-account',
  imports: [Login, Register, RouterLink],
  template: `
    <section aria-labelledby="account-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="account-title">My Account</h1>
        <p>Sign in or create an account. Account services are not connected in this preview.</p>
        <a class="profile-link" routerLink="/profile/me">View profile preview</a>
      </header>

      <div class="account-panel">
        <div
          class="tabs"
          role="tablist"
          aria-label="Account options"
          (keydown)="onTabKeydown($event)"
        >
          <button
            id="login-tab"
            type="button"
            role="tab"
            aria-controls="login-panel"
            [attr.aria-selected]="activeTab === 'login'"
            [tabIndex]="activeTab === 'login' ? 0 : -1"
            (click)="activeTab = 'login'"
          >
            Login
          </button>
          <button
            id="register-tab"
            type="button"
            role="tab"
            aria-controls="register-panel"
            [attr.aria-selected]="activeTab === 'register'"
            [tabIndex]="activeTab === 'register' ? 0 : -1"
            (click)="activeTab = 'register'"
          >
            Register
          </button>
        </div>

        @if (activeTab === 'login') {
          <section id="login-panel" role="tabpanel" aria-labelledby="login-tab" tabindex="0">
            <app-login [embedded]="true" />
          </section>
        } @else {
          <section id="register-panel" role="tabpanel" aria-labelledby="register-tab" tabindex="0">
            <app-register [embedded]="true" />
          </section>
        }
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
    .tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid #d7e0ed;
    }
    .tabs button {
      min-height: 2.75rem;
      padding: 0.5rem 1rem;
      border: 0;
      border-bottom: 3px solid transparent;
      color: #344b67;
      background: transparent;
      font: inherit;
      cursor: pointer;
    }
    .tabs button[aria-selected='true'] {
      border-bottom-color: #1d67c8;
      color: #142b48;
      font-weight: 700;
    }
    .tabs button:focus-visible,
    [role='tabpanel']:focus-visible {
      outline: 3px solid #1d67c8;
      outline-offset: 2px;
    }
    [role='tabpanel'] {
      padding-top: 1rem;
    }
  `,
})
export class Account {
  protected activeTab: AccountTab = 'login';

  protected onTabKeydown(event: KeyboardEvent): void {
    const tabs = Array.from(
      (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    const selectedIndex = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (selectedIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (selectedIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.activeTab = tabs[nextIndex].id === 'register-tab' ? 'register' : 'login';
    tabs[nextIndex].focus();
  }
}
