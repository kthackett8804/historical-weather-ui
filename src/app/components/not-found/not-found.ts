import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="not-found-title">
      <p class="code" aria-hidden="true">404</p>
      <h1 id="not-found-title">Page not found</h1>
      <p>The page you requested could not be found.</p>
      <a routerLink="/">Back to dashboard</a>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    section {
      max-width: 34rem;
      margin: clamp(2rem, 10vh, 6rem) auto;
      padding: clamp(1.5rem, 5vw, 2.5rem);
      border: 1px solid #d7e0ed;
      border-radius: 0.375rem;
      background: white;
      text-align: center;
    }
    .code {
      margin: 0 0 0.5rem;
      color: #1d67c8;
      font-size: clamp(2.5rem, 9vw, 4rem);
      font-weight: 700;
      line-height: 1;
    }
    h1 {
      margin: 0;
      color: #142b48;
      font-size: clamp(1.5rem, 5vw, 2rem);
    }
    section > p:not(.code) {
      margin: 0.75rem 0 1.5rem;
      color: #394b61;
      line-height: 1.5;
    }
    a {
      display: inline-flex;
      min-height: 2.75rem;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      color: white;
      background: #1d67c8;
      font-weight: 700;
      text-decoration: none;
    }
    a:hover {
      background: #164f9a;
    }
    a:focus-visible {
      outline: 3px solid #142b48;
      outline-offset: 3px;
    }
  `,
})
export class NotFound {}
