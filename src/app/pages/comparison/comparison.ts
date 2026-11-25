import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { ComparisonArea, CountryComparison } from '../../models';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-comparison',
  imports: [AsyncPipe, FormsModule, RouterLink],
  template: `
    <section aria-labelledby="comparison-title">
      <h1 id="comparison-title">Comparison</h1>
      @if (auth.isLoading$ | async) {
        <p role="status">Loading authentication...</p>
      } @else if (auth.isAuthenticated$ | async) {
        @if (loading()) {
          <p role="status">Loading comparison areas...</p>
        } @else if (error()) {
          <p role="alert">{{ error() }}</p>
        } @else if (areas().length) {
          <ul aria-label="Saved comparison areas">
            @for (area of areas(); track area._id) {
              <li>{{ area.label }}: {{ area.location_name }}, {{ area.country }}</li>
            }
          </ul>
        } @else {
          <p role="status">No comparison areas have been saved.</p>
        }

        <button type="button" data-compare (click)="compareCountries()"
          [disabled]="loading() || !canCompare()">
          Compare saved countries
        </button>
        @if (comparison().length) {
          <section aria-labelledby="comparison-results-title">
            <h2 id="comparison-results-title">Country comparison</h2>
            <ul>
              @for (country of comparison(); track country.country) {
                <li>{{ country.country }}: average {{ country.avg_temperature }}°C across
                  {{ country.records }} records</li>
              }
            </ul>
          </section>
        }

        <section aria-labelledby="comparison-form-title">
          <h2 id="comparison-form-title">Add a comparison area</h2>
          <form (ngSubmit)="submitComparisonArea()">
            <label for="comparison-country">Country</label>
            <input id="comparison-country" name="country" type="text" [ngModel]="country"
              (input)="onCountryInput($event)" required />
            <label for="comparison-location">Location name</label>
            <input id="comparison-location" name="locationName" type="text"
              [ngModel]="locationName" (input)="onLocationInput($event)" required />
            <label for="comparison-label">Label</label>
            <input id="comparison-label" name="label" type="text" [ngModel]="label"
              (input)="onLabelInput($event)" required />
            <button type="submit" [disabled]="saving()">Save comparison area</button>
            <p class="form-feedback" role="status" aria-live="polite">{{ feedback() }}</p>
          </form>
        </section>
      } @else if (showWarning) {
        <div class="warning-backdrop" role="presentation">
          <div class="warning-popup" role="alertdialog" aria-modal="true"
            aria-labelledby="auth-warning-title">
            <h2 id="auth-warning-title">Authentication required</h2>
            <p>You must be an authenticated user to compare weather records.</p>
            <div class="actions">
              <button type="button" (click)="showWarning = false">Close</button>
              <a routerLink="/login">Log in</a>
            </div>
          </div>
        </div>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    button, input { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    form { display: grid; gap: 0.75rem; max-width: 32rem; margin-block: 1.5rem; }
    ul { display: grid; gap: 0.75rem; padding: 0; list-style: none; }
    li { padding: 0.75rem; border: 1px solid #d7e0ed; background: white; }
    .form-feedback { margin: 0; }
    .warning-backdrop { position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 1rem; background: rgb(23 43 70 / 55%); }
    .warning-popup { width: min(100%, 24rem); padding: 1.25rem; border: 1px solid #d7e0ed; background: white; }
    .actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; }
  `,
})
export class Comparison {
  protected readonly auth = inject(ApiAuthService);
  private readonly api = inject(ApiService);
  protected showWarning = inject(ActivatedRoute).snapshot.queryParamMap.get('authRequired') === 'true';
  protected areas = signal<ComparisonArea[]>([]);
  protected comparison = signal<CountryComparison[]>([]);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal('');
  protected country = '';
  protected locationName = '';
  protected label = '';
  protected feedback = signal('');

  constructor() {
    const userId = this.auth.currentSession?.user_id;
    if (!userId) {
      this.error.set('Sign in again before loading comparison areas.');
      return;
    }

    this.loading.set(true);
    this.api.getComparisonAreas(userId).subscribe({
      next: (response) => {
        this.areas.set(response.comparison_areas);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load comparison areas.'));
        this.loading.set(false);
      },
    });
  }

  protected canCompare(): boolean {
    return new Set(this.areas().map((area) => area.country.trim().toLocaleLowerCase())).size >= 2;
  }

  protected compareCountries(): void {
    if (!this.canCompare()) return;
    this.error.set('');
    this.api.compareCountries().subscribe({
      next: (response) => this.comparison.set(response.countries),
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to compare saved countries.'));
      },
    });
  }

  protected onCountryInput(event: Event): void {
    this.country = (event.target as HTMLInputElement).value;
  }

  protected onLocationInput(event: Event): void {
    this.locationName = (event.target as HTMLInputElement).value;
  }

  protected onLabelInput(event: Event): void {
    this.label = (event.target as HTMLInputElement).value;
  }

  protected submitComparisonArea(): void {
    const userId = this.auth.currentSession?.user_id;
    if (!userId || !this.country.trim() || !this.locationName.trim() || !this.label.trim()) {
      this.feedback.set('Enter a country, location name, and label to continue.');
      return;
    }

    this.saving.set(true);
    this.feedback.set('');
    this.api.createComparisonArea(userId, {
      country: this.country.trim(),
      location_name: this.locationName.trim(),
      label: this.label.trim(),
    }).subscribe({
      next: (response) => {
        this.areas.update((areas) => [...areas, response.location]);
        this.feedback.set('Comparison area saved.');
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to save this comparison area.'));
        this.saving.set(false);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
