import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SAMPLE_REVIEWS, SAMPLE_WEATHER } from '../../weather-samples';
import type { WeatherRecord, WeatherReview } from '../../weather-samples';

@Component({
  selector: 'app-weather-details',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="details-title">
      <h1 id="details-title">Weather Details</h1>
      @if (weather; as record) {
        <p role="status">Sample record: {{ record.location }}, {{ record.country }}</p>
        <dl>
          <dt>Date</dt>
          <dd>{{ record.date }}</dd>
          <dt>Conditions</dt>
          <dd>{{ record.condition }}</dd>
          <dt>Temperature</dt>
          <dd>{{ record.temperatureC }}°C</dd>
          <dt>Precipitation</dt>
          <dd>{{ record.precipitationMm }} mm</dd>
        </dl>
        <nav aria-label="Related weather details">
          <a [routerLink]="['/weather', record.id, 'air-quality']">Air quality</a>
          <a [routerLink]="['/weather', record.id, 'astronomical-events']"> Astronomical events </a>
        </nav>
      } @else {
        <p role="status">
          {{
            weatherId
              ? 'No sample weather record found for this ID.'
              : 'Select a weather record to see details.'
          }}
        </p>
      }

      <section aria-labelledby="reviews-title">
        <h2 id="reviews-title">Reviews</h2>
        @if (reviews.length) {
          <ul>
            @for (review of reviews; track review.id) {
              <li>
                <h3>{{ review.author }} · {{ review.rating }} / 5</h3>
                <p>{{ review.comment }}</p>
                <p>{{ review.date }}</p>
              </li>
            }
          </ul>
        } @else {
          <p>No reviews are available for this record.</p>
        }
        @if (weather) {
          <form (submit)="submitReview($event)" novalidate>
            <h3>Add or update a review</h3>
            <label for="rating">Rating</label>
            <select id="rating" required (change)="onRatingChange($event)">
              <option value="">Select a rating</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
            <label for="review-text">Review</label>
            <textarea id="review-text" rows="4" required (input)="onReviewInput($event)"></textarea>
            <button type="submit">Submit review</button>
            <p class="review-feedback" role="status" aria-live="polite">{{ feedback }}</p>
          </form>
        } @else {
          <p>Review form is unavailable until a weather record is selected.</p>
        }
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    section section {
      margin-block: 1.5rem;
      padding: 1rem;
      border: 1px solid #d7e0ed;
      background: white;
    }
    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 0.5rem 1rem;
    }
    dt {
      font-weight: 700;
    }
    dd {
      margin: 0;
    }
    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    ul {
      display: grid;
      gap: 0.75rem;
      padding: 0;
      list-style: none;
    }
    li {
      padding: 0.75rem;
      border: 1px solid #d7e0ed;
    }
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 32rem;
      margin-top: 1.5rem;
    }
    select,
    textarea,
    button {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
    }
    textarea {
      resize: vertical;
    }
    .review-feedback {
      margin: 0;
    }
  `,
})
export class WeatherDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected weatherId: string | null = null;
  protected weather: WeatherRecord | undefined;
  protected reviews: WeatherReview[] = [];
  protected rating = '';
  protected reviewText = '';
  protected feedback = '';

  ngOnInit(): void {
    this.weatherId = this.route.snapshot.paramMap.get('id');
    this.weather = SAMPLE_WEATHER.find((record) => record.id === this.weatherId);
    this.reviews = SAMPLE_REVIEWS.filter((review) => review.weatherId === this.weatherId);
  }

  protected onRatingChange(event: Event): void {
    this.rating = (event.target as HTMLSelectElement).value;
  }

  protected onReviewInput(event: Event): void {
    this.reviewText = (event.target as HTMLTextAreaElement).value;
  }

  protected submitReview(event: Event): void {
    event.preventDefault();

    if (!this.rating || !this.reviewText.trim()) {
      this.feedback = 'Enter a rating and review to continue.';
      return;
    }

    this.feedback = 'Reviews are not connected in this preview. Your review was not saved.';
  }
}
