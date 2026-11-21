import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SAMPLE_WEATHER } from '../../weather-samples';

@Component({
  selector: 'app-weather',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="weather-title">
      <h1 id="weather-title">Weather Explorer</h1>
      <p role="status">Showing sample weather records. Select a record for details.</p>
      <form aria-label="Weather filters" (submit)="applyFilters($event)">
        <label for="location">Search by country or location</label>
        <input
          id="location"
          type="search"
          [value]="locationQuery"
          (input)="onLocationInput($event)"
        />
        <label for="country">Country</label>
        <select id="country" [value]="selectedCountry" (change)="onCountryChange($event)">
          <option value="">All countries</option>
          @for (country of countries; track country) {
            <option [value]="country">{{ country }}</option>
          }
        </select>
        <label for="sort">Sort by date</label>
        <select id="sort" [value]="selectedSort" (change)="onSortChange($event)">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <section aria-labelledby="results-title" class="results">
        <h2 id="results-title">Weather records</h2>
        <p>{{ filteredWeatherRecords.length }} sample records found.</p>
        @if (filteredWeatherRecords.length) {
          <ul>
            @for (record of filteredWeatherRecords; track record.id) {
              <li>
                <a [routerLink]="['/weather', record.id]">
                  <h3>{{ record.location }}, {{ record.country }}</h3>
                  <p>{{ record.date }} · {{ record.condition }}</p>
                  <p>{{ record.temperatureC }}°C · {{ record.precipitationMm }} mm precipitation</p>
                  <span>View weather details</span>
                </a>
              </li>
            }
          </ul>
        } @else {
          <p>No sample weather records match these filters.</p>
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
export class Weather {
  protected readonly countries = [
    ...new Set(SAMPLE_WEATHER.map((record) => record.country)),
  ].sort();
  protected locationQuery = '';
  protected selectedCountry = '';
  protected selectedSort: 'newest' | 'oldest' = 'newest';
  private appliedLocation = '';
  private appliedCountry = '';
  private appliedSort: 'newest' | 'oldest' = 'newest';

  protected get filteredWeatherRecords() {
    const query = this.appliedLocation.trim().toLocaleLowerCase();
    const records = SAMPLE_WEATHER.filter((record) => {
      const matchesQuery =
        !query || `${record.location} ${record.country}`.toLocaleLowerCase().includes(query);
      const matchesCountry = !this.appliedCountry || record.country === this.appliedCountry;
      return matchesQuery && matchesCountry;
    });

    return records.sort((first, second) =>
      this.appliedSort === 'newest'
        ? second.date.localeCompare(first.date)
        : first.date.localeCompare(second.date),
    );
  }

  protected onLocationInput(event: Event): void {
    this.locationQuery = (event.target as HTMLInputElement).value;
  }

  protected onCountryChange(event: Event): void {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
  }

  protected onSortChange(event: Event): void {
    this.selectedSort =
      (event.target as HTMLSelectElement).value === 'oldest' ? 'oldest' : 'newest';
  }

  protected applyFilters(event: Event): void {
    event.preventDefault();
    this.appliedLocation = this.locationQuery;
    this.appliedCountry = this.selectedCountry;
    this.appliedSort = this.selectedSort;
  }
}
