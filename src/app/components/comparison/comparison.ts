import { Component } from '@angular/core';

@Component({
  selector: 'app-comparison',
  template: `
    <section aria-labelledby="comparison-title">
      <h1 id="comparison-title">Comparison</h1>
      <p role="status">No weather records are selected for comparison.</p>
      <button type="button" disabled>Compare selected records</button>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    button {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
    }
  `,
})
export class Comparison {}
