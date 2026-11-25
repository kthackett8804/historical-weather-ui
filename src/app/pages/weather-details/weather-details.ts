import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { WeatherRecord, WeatherReview } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-weather-details',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="details-title">
      <h1 id="details-title">Weather Details</h1>
      @if (loading()) {
        <p role="status">Loading weather details...</p>
      } @else if (error()) {
        <p role="alert">{{ error() }}</p>
      } @else if (weather(); as record) {
        <p role="status">{{ record.location_name }}, {{ record.country }}</p>
        <dl>
          <dt>Last updated</dt>
          <dd>{{ record.last_updated }}</dd>
          <dt>Conditions</dt>
          <dd>{{ record.condition_text }}</dd>
          <dt>Temperature</dt>
          <dd>{{ record.temperature_celsius }}°C</dd>
          <dt>Precipitation</dt>
          <dd>{{ record.precip_mm }} mm</dd>
        </dl>
        <nav aria-label="Related weather details">
          <a [routerLink]="['/weather', record._id, 'air-quality']">Air quality</a>
          <a [routerLink]="['/weather', record._id, 'astronomical-events']"> Astronomical events </a>
        </nav>
      } @else {
        <p role="status">
          {{
            weatherId
              ? 'No weather record found for this ID.'
              : 'Select a weather record to see details.'
          }}
        </p>
      }

      <section aria-labelledby="reviews-title">
        <h2 id="reviews-title">Reviews</h2>
        @if (reviews().length) {
          <ul>
            @for (review of reviews(); track review._id) {
              <li>
                <h3>{{ review.username }} · {{ review.rating }} / 5</h3>
                <p>{{ review.comment }}</p>
              </li>
            }
          </ul>
        } @else {
          <p>No reviews are available for this record.</p>
        }
        @if (weather()) {
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
            <p class="review-feedback" role="status" aria-live="polite">{{ feedback() }}</p>
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
  private readonly api = inject(ApiService);
  protected weatherId: string | null = null;
  protected weather = signal<WeatherRecord | null>(null);
  protected reviews = signal<WeatherReview[]>([]);
  protected loading = signal(false);
  protected error = signal('');
  protected rating = '';
  protected reviewText = '';
  protected feedback = signal('');

  ngOnInit(): void {
    this.weatherId = this.route.snapshot.paramMap.get('id');
    if (!this.weatherId) return;

    this.loading.set(true);
    this.api.getWeatherRecord(this.weatherId).subscribe({
      next: (response) => {
        this.weather.set(response.weather);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          error instanceof HttpErrorResponse
            ? error.error?.message ?? 'Unable to load this weather record.'
            : 'Unable to load this weather record.',
        );
        this.loading.set(false);
      },
    });
    this.api.getWeatherRecordReviews(this.weatherId).subscribe({
      next: (response) => this.reviews.set(response.weather_reviews),
      error: (error: unknown) => {
        this.feedback.set(
          error instanceof HttpErrorResponse
            ? error.error?.message ?? 'Unable to load reviews.'
            : 'Unable to load reviews.',
        );
      },
    });
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
      this.feedback.set('Enter a rating and review to continue.');
      return;
    }

    if (!this.weatherId) return;

    this.feedback.set('');
    this.api
      .createWeatherReview(this.weatherId, {
        rating: Number(this.rating),
        comment: this.reviewText.trim(),
      })
      .subscribe({
        next: (response) => {
          this.reviews.update((reviews) => [...reviews, response.weather_review]);
          this.feedback.set('Your review was submitted.');
          this.rating = '';
          this.reviewText = '';
        },
        error: (error: unknown) => {
          this.feedback.set(
            error instanceof HttpErrorResponse
              ? error.error?.message ?? 'Unable to submit your review.'
              : 'Unable to submit your review.',
          );
        },
      });
  }
}
