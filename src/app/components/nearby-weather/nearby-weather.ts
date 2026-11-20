import { Component } from '@angular/core';

@Component({
  selector: 'app-nearby-weather',
  template: `
    <section aria-labelledby="nearby-title">
      <h1 id="nearby-title">Nearby Weather</h1>
      <p role="status">Nearby weather is not connected in this preview.</p>
      <form aria-label="Nearby weather search">
        <label for="latitude">Latitude</label>
        <input id="latitude" type="number" disabled />
        <label for="longitude">Longitude</label>
        <input id="longitude" type="number" disabled />
        <label for="distance">Maximum distance (km)</label>
        <input id="distance" type="number" disabled />
        <button type="button" disabled>Find nearby weather</button>
      </form>
      <p>No nearby weather records are available.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 30rem;
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
export class NearbyWeather {}
