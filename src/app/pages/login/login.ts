import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiAuthService } from '../../services/api-auth.service';
import { ValidationService } from '../../services/validation.service';

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
        @if (showWarning) {
          <p role="alert">Sign in to continue to the requested page.</p>
        }
        @if (registrationComplete()) {
          <p role="status">Account created. You can now sign in.</p>
        }
        @if (auth.isLoading$ | async) {
          <p role="status">Loading authentication...</p>
        } @else if ((auth.isAuthenticated$ | async) && (auth.user$ | async); as user) {
          <p>Logged in as {{ user.email }}</p>
          <button type="button" (click)="logout()">Logout</button>
        } @else {
          @if (auth.error$ | async; as error) {
            <p class="error" role="alert">{{ error }}</p>
          }
          @if (isCreatingAccount()) {
            <p>Create an email/password account</p>
            <form (submit)="register($event)">
              <label for="register-username">Username</label>
              <input id="register-username" type="text" autocomplete="username" required
                [value]="username" (input)="onUsernameInput($event)" />
              <label for="register-email">Email</label>
              <input id="register-email" type="email" autocomplete="email" required
                [value]="email" (input)="onEmailInput($event)" />
              <label for="register-password">Password</label>
              <input id="register-password" type="password" autocomplete="new-password" required
                [value]="password" (input)="onPasswordInput($event)" />
              <button type="submit" [disabled]="isSubmitting()">Create account</button>
              @if (feedback()) {
                <p class="error" role="alert">{{ feedback() }}</p>
              }
            </form>
            <button type="button" data-show-login (click)="showLogin()">Back to sign in</button>
          } @else {
            <p>Welcome back</p>
            <form (submit)="login($event)">
              <label for="username">Username</label>
              <input id="username" type="text" autocomplete="username" required
                [value]="username" (input)="onUsernameInput($event)" />
              <label for="password">Password</label>
              <input id="password" type="password" autocomplete="current-password" required
                [value]="password" (input)="onPasswordInput($event)" />
              <button type="submit" [disabled]="isSubmitting()">Log in with email</button>
              @if (feedback()) {
                <p class="error" role="alert">{{ feedback() }}</p>
              }
            </form>
            <button data-auth-login type="button" (click)="loginWithAuth0()">
              Log in with Auth0
            </button>
            <button data-auth-signup type="button" (click)="signUpWithAuth0()">
              Sign up with Auth0
            </button>
            <button data-show-register type="button" (click)="showRegistration()">
              Create an email/password account
            </button>
          }
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
    form {
      display: grid;
      gap: 0.5rem;
      margin-top: 1rem;
      text-align: left;
    }
    input {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
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
  protected readonly auth = inject(ApiAuthService);
  private readonly validation = inject(ValidationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly showWarning = Boolean(this.route.snapshot.queryParamMap.get('authRequired'));
  protected username = '';
  protected email = '';
  protected password = '';
  protected feedback = signal('');
  protected isSubmitting = signal(false);
  protected isCreatingAccount = signal(false);
  protected registrationComplete = signal(false);

  protected onUsernameInput(event: Event): void {
    this.username = (event.target as HTMLInputElement).value;
  }

  protected onEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value;
  }

  protected onPasswordInput(event: Event): void {
    this.password = (event.target as HTMLInputElement).value;
  }

  protected showRegistration(): void {
    this.feedback.set('');
    this.registrationComplete.set(false);
    this.isCreatingAccount.set(true);
  }

  protected showLogin(): void {
    this.feedback.set('');
    this.isCreatingAccount.set(false);
  }

  protected login(event: Event): void {
    event.preventDefault();
    if (!this.username.trim() || !this.password) {
      this.feedback.set('Enter a username and password.');
      return;
    }

    this.feedback.set('');
    this.isSubmitting.set(true);
    this.auth.login({ username: this.username.trim(), password: this.password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        void this.router.navigateByUrl('/');
      },
      error: () => this.isSubmitting.set(false),
    });
  }

  protected register(event: Event): void {
    event.preventDefault();
    const username = this.validation.validateUsername(this.username);
    const email = this.validation.validateEmail(this.email);
    const password = this.validation.validatePassword(this.password);
    if (!username.valid || !email.valid || !password.valid) {
      this.feedback.set(
        username.error ?? email.error ?? password.error ?? 'Check your account details.',
      );
      return;
    }

    this.feedback.set('');
    this.isSubmitting.set(true);
    this.auth.register({
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isCreatingAccount.set(false);
        this.registrationComplete.set(true);
        this.password = '';
      },
      error: () => this.isSubmitting.set(false),
    });
  }

  protected loginWithAuth0(): void {
    this.auth.startAuth0Login();
  }

  protected signUpWithAuth0(): void {
    this.auth.startAuth0Signup();
  }

  protected logout(): void {
    this.auth.logout().subscribe({ error: () => undefined });
  }
}
