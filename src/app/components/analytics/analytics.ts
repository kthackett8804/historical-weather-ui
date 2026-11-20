import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  template: `
    <section aria-labelledby="analytics-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="analytics-title">Analytics</h1>
        <p role="status">Weather data is not connected in this preview.</p>
      </header>

      <section aria-labelledby="country-summary-title">
        <h2 id="country-summary-title">Country Summary</h2>
        <p>No country summary available.</p>
      </section>

      <section aria-labelledby="monthly-trends-title">
        <h2 id="monthly-trends-title">Monthly Trends</h2>
        <p>No monthly trend data available.</p>
      </section>

      <section aria-labelledby="extreme-weather-title">
        <h2 id="extreme-weather-title">Extreme Weather</h2>
        <p>No extreme weather data available.</p>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .page-heading {
      margin-bottom: 2rem;
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
    h2 {
      margin: 0 0 0.75rem;
      font-size: 1.25rem;
    }
    section + section {
      margin-top: 1.5rem;
      padding: 1rem;
      border: 1px solid #d7e0ed;
      background: #fff;
    }
    section + section p {
      margin: 0;
      color: #536b87;
    }
  `,
})
export class Analytics {}
