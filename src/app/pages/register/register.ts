import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  host: {
    '[class.embedded]': 'embedded',
  },
  template: `
    <div class="page" [attr.role]="embedded ? null : 'main'">
      <section aria-labelledby="register-title">
        @if (!embedded) {
          <a class="brand" routerLink="/" aria-label="Weather Atlas home">☁</a>
        }
        <h1 id="register-title">Weather Atlas</h1>
        <p>Join us today</p>
        <form novalidate (submit)="submit(); $event.preventDefault()">
          <label for="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autocomplete="username"
            required
            aria-describedby="username-error"
            [attr.aria-invalid]="submitted && usernameInvalid"
            #usernameInput
            (input)="usernameValue = usernameInput.value"
          />
          @if (submitted && usernameInvalid) {
            <p class="error" id="username-error">Enter a username.</p>
          }
          <label for="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            aria-describedby="email-error"
            [attr.aria-invalid]="submitted && emailInvalid"
            #emailInput
            (input)="emailValue = emailInput.value"
          />
          @if (submitted && emailInvalid) {
            <p class="error" id="email-error">Enter a valid email address.</p>
          }
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            aria-describedby="password-error"
            [attr.aria-invalid]="submitted && passwordInvalid"
            #passwordInput
            (input)="passwordValue = passwordInput.value"
          />
          @if (submitted && passwordInvalid) {
            <p class="error" id="password-error">Enter a password.</p>
          }
          <button type="submit">Register</button>
        </form>
        @if (notice) {
          <p role="status">{{ notice }}</p>
        }
        @if (!embedded) {
          <p>Already have an account? <a routerLink="/login">Login</a></p>
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
    form {
      display: grid;
      gap: 0.5rem;
      margin-top: 1.5rem;
      text-align: left;
    }
    label {
      font-weight: 700;
    }
    input {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid #9aabc0;
      border-radius: 0.25rem;
      font: inherit;
    }
    input:focus-visible,
    a:focus-visible,
    button:focus-visible {
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
export class Register {
  @Input() embedded = false;
  protected usernameValue = '';
  protected emailValue = '';
  protected passwordValue = '';
  protected submitted = false;
  protected notice = '';

  protected get usernameInvalid(): boolean {
    return !this.usernameValue.trim();
  }

  protected get emailInvalid(): boolean {
    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.emailValue.trim());
  }

  protected get passwordInvalid(): boolean {
    return !this.passwordValue.trim();
  }

  protected submit(): void {
    this.submitted = true;
    this.notice = '';

    if (this.usernameInvalid || this.emailInvalid || this.passwordInvalid) return;

    this.notice = 'Registration is not connected. No account has been created.';
  }
}
