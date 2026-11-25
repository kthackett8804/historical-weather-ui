import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { WeatherRecord } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-weather-search',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="search-title">
      <h1 id="search-title">Weather Search</h1>
      <p role="status" aria-live="polite">
        @if (loading()) {
          Searching weather records...
        } @else if (error()) {
          {{ error() }}
        } @else {
          {{ totalCount() }} weather record{{ totalCount() === 1 ? '' : 's' }} found.
        }
      </p>
      <form aria-label="Search weather records" (submit)="searchRecords($event)">
        <label for="countries">Countries</label>
        <input
          id="countries"
          type="text"
          placeholder="Country names, separated by commas"
          [value]="countries"
          (input)="onCountriesInput($event)"
        />
        <label for="condition">Weather condition</label>
        <input
          id="condition"
          type="text"
          placeholder="Condition"
          [value]="condition"
          (input)="onConditionInput($event)"
        />
        <button type="submit" [disabled]="loading()">Search</button>
      </form>
      @if (records().length) {
        <ul>
          @for (record of records(); track record._id) {
            <li>
              <a [routerLink]="['/weather', record._id]">
                <h2>{{ record.location_name }}, {{ record.country }}</h2>
                <p>{{ record.last_updated }} · {{ record.condition_text }}</p>
                <p>{{ record.temperature_celsius }}°C</p>
              </a>
            </li>
          }
        </ul>
      } @else if (!loading() && !error()) {
        <p>No weather records found.</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 36rem;
      margin-block: 1.5rem;
    }
    input,
    button {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
    }
    ul {
      display: grid;
      gap: 1rem;
      padding: 0;
      list-style: none;
    }
    li {
      border: 1px solid #d7e0ed;
      background: white;
    }
    a {
      display: block;
      padding: 1rem;
      color: inherit;
      text-decoration: none;
    }
  `,
})
export class WeatherSearch {
  private readonly api = inject(ApiService);
  protected countries = '';
  protected condition = '';
  protected records = signal<WeatherRecord[]>([]);
  protected totalCount = signal(0);
  protected loading = signal(false);
  protected error = signal('');

  protected onCountriesInput(event: Event): void {
    this.countries = (event.target as HTMLInputElement).value;
  }

  protected onConditionInput(event: Event): void {
    this.condition = (event.target as HTMLInputElement).value;
  }

  protected searchRecords(event: Event): void {
    event.preventDefault();
    this.loading.set(true);
    this.error.set('');
    this.api
      .searchWeatherRecords({
        countries: this.countries.trim() || undefined,
        condition_text: this.condition.trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.records.set(response.data);
          this.totalCount.set(response.total_count);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(
            error instanceof HttpErrorResponse
              ? error.error?.message ?? 'Unable to search weather records.'
              : 'Unable to search weather records.',
          );
          this.loading.set(false);
        },
      });
  }
}
