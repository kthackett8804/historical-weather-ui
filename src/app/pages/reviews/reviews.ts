import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SAMPLE_REVIEWS, SAMPLE_WEATHER } from '../../weather-samples';

@Component({
  selector: 'app-reviews',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="reviews-title">
      <h1 id="reviews-title">Reviews</h1>
      <p role="status">Showing sample reviews for the sample weather records.</p>
      <ul>
        @for (review of reviews; track review.id) {
          <li>
            <a [routerLink]="['/weather', review.weatherId]">
              <h2>{{ review.author }} · {{ review.rating }} / 5</h2>
              <p>{{ review.comment }}</p>
              <p>
                Review for
                {{ weatherLocation(review.weatherId) }}
                · {{ review.date }}
              </p>
              <span>View weather record and reviews</span>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    ul {
      display: grid;
      gap: 1rem;
      max-width: 48rem;
      padding: 0;
      list-style: none;
    }
    li {
      border: 1px solid #d7e0ed;
      background: white;
    }
    a {
      display: block;
      padding: 1rem;
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      border-color: #1d67c8;
    }
    a:focus-visible {
      outline: 3px solid #1d67c8;
      outline-offset: 3px;
    }
  `,
})
export class Reviews {
  protected readonly reviews = SAMPLE_REVIEWS;

  protected weatherLocation(weatherId: string): string {
    const record = SAMPLE_WEATHER.find((item) => item.id === weatherId);
    return record ? `${record.location}, ${record.country}` : 'weather record';
  }
}
