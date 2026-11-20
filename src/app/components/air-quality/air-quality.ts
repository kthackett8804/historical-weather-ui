import { Component } from '@angular/core';

@Component({
  selector: 'app-air-quality',
  template: `
    <section aria-labelledby="air-quality-title">
      <h1 id="air-quality-title">Air Quality</h1>
      <p role="status">No air-quality readings are available in this preview.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AirQuality {}
