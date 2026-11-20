import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  template: `
    <section aria-labelledby="reviews-title">
      <h1 id="reviews-title">Reviews</h1>
      <p role="status">No reviews are available in this preview.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Reviews {}
