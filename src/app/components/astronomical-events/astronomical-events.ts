import { Component } from '@angular/core';

@Component({
  selector: 'app-astronomical-events',
  template: `
    <section aria-labelledby="events-title">
      <h1 id="events-title">Astronomical Events</h1>
      <p role="status">No astronomical events are available in this preview.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AstronomicalEvents {}
