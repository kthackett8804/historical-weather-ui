import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-favourites',
  imports: [AsyncPipe, FormsModule, RouterLink],
  template: `
    <section aria-labelledby="favourites-title">
      <h1 id="favourites-title">Favourites</h1>
      @if (auth.isLoading$ | async) {
        <p role="status">Loading authentication...</p>
      } @else if (auth.isAuthenticated$ | async) {
        <p role="status">No favourite locations have been saved.</p>
        <section aria-labelledby="favourite-form-title">
          <h2 id="favourite-form-title">Add or update a favourite location</h2>
          <p>Changes are only previewed here and will not be saved.</p>
          <form (ngSubmit)="submitFavourite()">
            <label for="favourite-country">Country</label>
            <input
              id="favourite-country"
              name="country"
              type="text"
              [ngModel]="country"
              (input)="onCountryInput($event)"
              required
            />

            <label for="favourite-location">Location name</label>
            <input
              id="favourite-location"
              name="locationName"
              type="text"
              [ngModel]="locationName"
              (input)="onLocationInput($event)"
              required
            />

            <label class="checkbox-label" for="favourite-preferred">
              <input
                id="favourite-preferred"
                name="preferred"
                type="checkbox"
                [ngModel]="preferred"
                (change)="onPreferredChange($event)"
              />
              Preferred location
            </label>

            <button type="submit">Save favourite</button>
            <p class="form-feedback" role="status" aria-live="polite">{{ feedback }}</p>
          </form>
        </section>
      } @else if (showWarning) {
        <div class="warning-backdrop" role="presentation">
          <div class="warning-popup" role="alertdialog" aria-modal="true" aria-labelledby="auth-warning-title">
            <h2 id="auth-warning-title">Authentication required</h2>
            <p>You must be an authenticated user to view favourites.</p>
            <div class="actions">
              <button type="button" class="close-button" (click)="showWarning = false">Close</button>
              <a routerLink="/login" class="login-link">Log in</a>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form { display: grid; gap: 0.75rem; max-width: 32rem; margin-block: 1.5rem; }
    input, button { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; }
    .checkbox-label input { min-height: auto; }
    .form-feedback { margin: 0; }
    .warning-backdrop { position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 1rem; background: rgb(23 43 70 / 55%); }
    .warning-popup { width: min(100%, 24rem); padding: 1.25rem; border: 1px solid #d7e0ed; border-radius: 0.5rem; background: white; box-shadow: 0 0.75rem 2rem rgb(23 43 70 / 25%); }
    .warning-popup h2 { margin: 0 0 0.5rem; }
    .warning-popup p { margin: 0; color: #536b87; }
    .actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; }
    button, .login-link { min-height: 2.75rem; padding: 0.65rem 0.75rem; border: 1px solid #1d67c8; border-radius: 0.25rem; font: inherit; font-weight: 700; text-decoration: none; }
    .close-button { color: #1d67c8; background: white; cursor: pointer; }
    .login-link { color: white; background: #1d67c8; }
  `,
})
export class Favourites {
  protected readonly auth = inject(AuthService);
  protected showWarning = inject(ActivatedRoute).snapshot.queryParamMap.get('authRequired') === 'true';
  protected country = '';
  protected locationName = '';
  protected preferred = false;
  protected feedback = '';

  protected onCountryInput(event: Event): void {
    this.country = (event.target as HTMLInputElement).value;
  }

  protected onLocationInput(event: Event): void {
    this.locationName = (event.target as HTMLInputElement).value;
  }

  protected onPreferredChange(event: Event): void {
    this.preferred = (event.target as HTMLInputElement).checked;
  }

  protected submitFavourite(): void {
    if (!this.country.trim() || !this.locationName.trim()) {
      this.feedback = 'Enter a country and location name to continue.';
      return;
    }

    this.feedback = 'Favourites are not connected in this preview. Your favourite was not saved.';
  }
}
