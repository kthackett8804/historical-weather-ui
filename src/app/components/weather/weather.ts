import { Component } from '@angular/core';

@Component({
  selector: 'app-weather',
  template: `
    <section aria-labelledby="weather-title">
      <h1 id="weather-title">Weather Explorer</h1>
      <p role="status">Weather data is not connected in this preview.</p>
      <form aria-label="Weather filters">
        <label for="location">Search by country or location</label>
        <input id="location" type="search" disabled />
        <label for="country">Country</label>
        <select id="country" disabled>
          <option>All countries</option>
        </select>
        <label for="sort">Sort by</label>
        <select id="sort" disabled>
          <option>Date</option>
        </select>
        <button type="button" disabled>Search</button>
      </form>
      <section aria-labelledby="results-title">
        <h2 id="results-title">Weather records</h2>
        <p>No weather records are available in this preview.</p>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form,
    section section {
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
    section section {
      padding: 1rem;
      border: 1px solid #d7e0ed;
      background: white;
    }
  `,
})
export class Weather {}
