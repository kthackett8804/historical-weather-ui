import { Component } from '@angular/core';

@Component({
  selector: 'app-favourites',
  template: `
    <section aria-labelledby="favourites-title">
      <h1 id="favourites-title">Favourites</h1>
      <p role="status">No favourite locations have been saved.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Favourites {}
