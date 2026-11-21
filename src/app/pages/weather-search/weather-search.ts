import { Component } from '@angular/core';

@Component({
  selector: 'app-weather-search',
  template: `
    <section aria-labelledby="search-title">
      <h1 id="search-title">Weather Search</h1>
      <p role="status">Weather data is not connected in this preview.</p>
      <form aria-label="Search weather records">
        <label for="countries">Countries</label>
        <input id="countries" type="text" placeholder="Country names" disabled />
        <label for="condition">Weather condition</label>
        <input id="condition" type="text" placeholder="Condition" disabled />
        <button type="button" disabled>Search</button>
      </form>
      <p>No matching weather records are available.</p>
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
  `,
})
export class WeatherSearch {}
