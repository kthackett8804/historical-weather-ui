import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <section aria-labelledby="dashboard-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="dashboard-title">Dashboard</h1>
        <p role="status">Weather data is not connected in this preview.</p>
      </header>

      <section aria-labelledby="summary-title">
        <h2 id="summary-title">Summary</h2>
        <div class="summary-grid">
          <article>
            <h3>Weather records</h3>
            <p>No summary data available.</p>
          </article>
          <article>
            <h3>Countries covered</h3>
            <p>No summary data available.</p>
          </article>
          <article>
            <h3>Average temperature</h3>
            <p>No summary data available.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="trends-title">
        <h2 id="trends-title">Weather Trends</h2>
        <div class="trend-grid">
          <article>
            <h3>Temperature over time</h3>
            <p>No trend data available.</p>
          </article>
          <article>
            <h3>Rainfall over time</h3>
            <p>No trend data available.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="favourites-title">
        <h2 id="favourites-title">Favourites</h2>
        <p class="empty-state">No favourite locations yet.</p>
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
      margin: 0 0 1rem;
      font-size: 1.25rem;
    }
    h3 {
      margin: 0;
      font-size: 1rem;
    }
    .summary-grid,
    .trend-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
      gap: 1rem;
    }
    article,
    .empty-state {
      margin: 0;
      padding: 1rem;
      border: 1px solid #d7e0ed;
      background: #fff;
    }
    article p {
      margin: 0.75rem 0 0;
      color: #536b87;
    }
    section + section {
      margin-top: 2rem;
    }
  `,
})
export class Home {}
