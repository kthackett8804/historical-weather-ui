import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { WeatherRecord } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-weather',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="weather-title">
      <h1 id="weather-title">Weather Explorer</h1>
      <p role="status" aria-live="polite">
        @if (loading()) {
          Loading weather records...
        } @else if (error()) {
          {{ error() }}
        } @else {
          {{ totalCount() }} weather record{{ totalCount() === 1 ? '' : 's' }} found.
        }
      </p>
      <form aria-label="Weather filters" (submit)="applyFilters($event)">
        <label for="location">Search by location</label>
        <input
          id="location"
          type="search"
          [value]="locationQuery"
          (input)="onLocationInput($event)"
        />
        <label for="country">Country</label>
        <input
          id="country"
          type="text"
          [value]="selectedCountry"
          (input)="onCountryInput($event)"
        />
        <label for="sort">Sort by date</label>
        <select id="sort" [value]="selectedSort" (change)="onSortChange($event)">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <section aria-labelledby="results-title" class="results">
        <h2 id="results-title">Weather records</h2>
        @if (weatherRecords().length) {
          <ul>
            @for (record of weatherRecords(); track record._id) {
              <li>
                <a [routerLink]="['/weather', record._id]">
                  <h3>{{ record.location_name }}, {{ record.country }}</h3>
                  <p>{{ record.last_updated }} · {{ record.condition_text }}</p>
                  <p>{{ record.temperature_celsius }}°C · {{ record.precip_mm }} mm precipitation</p>
                  <span>View weather details</span>
                </a>
              </li>
            }
          </ul>
        } @else {
          <p>No weather records match these filters.</p>
        }
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 42rem;
      margin-block: 1.5rem;
    }
    input,
    select,
    button {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
    }
    .results {
      margin-block: 1.5rem;
    }
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
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
      height: 100%;
      padding: 1rem;
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      border-color: #1d67c8;
    }
    a:focus-visible {
      outline: 3px solid #1d67c8;
      outline-offset: 3px;
    }
    h3 {
      margin-top: 0;
    }
  `,
})
export class Weather implements OnInit {
  private readonly api = inject(ApiService);
  protected weatherRecords = signal<WeatherRecord[]>([]);
  protected totalCount = signal(0);
  protected loading = signal(false);
  protected error = signal('');
  protected locationQuery = '';
  protected selectedCountry = '';
  protected selectedSort: 'newest' | 'oldest' = 'newest';

  ngOnInit(): void {
    this.loadRecords();
  }

  private loadRecords(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .getWeatherRecords({
        page: 1,
        per_page: 20,
        location_name: this.locationQuery.trim() || undefined,
        country: this.selectedCountry || undefined,
        sort_by: 'date',
        order: this.selectedSort === 'newest' ? 'desc' : 'asc',
      })
      .subscribe({
        next: (response) => {
          this.weatherRecords.set(response.data);
          this.totalCount.set(response.total_count);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(
            error instanceof HttpErrorResponse
              ? error.error?.message ?? 'Unable to load weather records.'
              : 'Unable to load weather records.',
          );
          this.loading.set(false);
        },
      });
  }

  protected onLocationInput(event: Event): void {
    this.locationQuery = (event.target as HTMLInputElement).value;
  }

  protected onCountryInput(event: Event): void {
    this.selectedCountry = (event.target as HTMLInputElement).value;
  }

  protected onSortChange(event: Event): void {
    this.selectedSort =
      (event.target as HTMLSelectElement).value === 'oldest' ? 'oldest' : 'newest';
  }

  protected applyFilters(event: Event): void {
    event.preventDefault();
    this.loadRecords();
  }
}
