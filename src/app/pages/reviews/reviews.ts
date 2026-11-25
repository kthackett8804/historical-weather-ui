import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type { WeatherRecord, WeatherReview } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reviews',
  imports: [FormsModule, RouterLink],
  template: `
    <section aria-labelledby="reviews-title">
      <h1 id="reviews-title">Reviews</h1>
      @if (loading()) {
        <p role="status">Loading weather reviews...</p>
      } @else if (error()) {
        <p role="alert">{{ error() }}</p>
      } @else if (reviews().length) {
        <ul>
          @for (review of reviews(); track review._id) {
            <li>
              @if (review.weather_id) {
                <a [routerLink]="['/weather', review.weather_id]">
                  <h2>{{ review.username }} · {{ review.rating }} / 5</h2>
                  <p>{{ review.comment }}</p>
                  <p>Review for {{ weatherLocation(review) }}</p>
                  <span>View weather record and reviews</span>
                </a>
              } @else {
                <h2>{{ review.username }} · {{ review.rating }} / 5</h2>
                <p>{{ review.comment }}</p>
              }
            </li>
          }
        </ul>
      } @else {
        <p role="status">No weather reviews are available.</p>
      }

      <section aria-labelledby="review-form-title" class="review-form-section">
        <h2 id="review-form-title">Add a review</h2>
        <form (ngSubmit)="submitReview()">
          <label for="review-weather">Weather record</label>
          <select id="review-weather" name="weatherId" [ngModel]="weatherId"
            (change)="onWeatherChange($event)" required>
            <option value="">Select a weather record</option>
            @for (record of weatherRecords(); track record._id) {
              <option [value]="record._id">{{ record.location_name }}, {{ record.country }}</option>
            }
          </select>

          <label for="review-rating">Rating</label>
          <select id="review-rating" name="rating" [ngModel]="rating"
            (change)="onRatingChange($event)" required>
            <option value="">Select a rating</option>
            <option value="1">1 star</option>
            <option value="2">2 stars</option>
            <option value="3">3 stars</option>
            <option value="4">4 stars</option>
            <option value="5">5 stars</option>
          </select>

          <label for="review-comment">Review</label>
          <textarea id="review-comment" name="comment" rows="4" [ngModel]="comment"
            (input)="onCommentInput($event)" required></textarea>
          <button type="submit" [disabled]="saving()">Submit review</button>
          <p class="form-feedback" role="status" aria-live="polite">{{ feedback() }}</p>
        </form>
      </section>
    </section>
  `,
  styles: `
    :host { display: block; }
    ul { display: grid; gap: 1rem; max-width: 48rem; padding: 0; list-style: none; }
    li { border: 1px solid #d7e0ed; background: white; }
    li > a { display: block; padding: 1rem; color: inherit; text-decoration: none; }
    li > a:hover { border-color: #1d67c8; }
    li > a:focus-visible { outline: 3px solid #1d67c8; outline-offset: 3px; }
    .review-form-section { max-width: 32rem; margin-block: 1.5rem; }
    form { display: grid; gap: 0.75rem; }
    select, textarea, button { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    textarea { resize: vertical; }
    .form-feedback { margin: 0; }
  `,
})
export class Reviews implements OnInit {
  private readonly api = inject(ApiService);
  protected reviews = signal<WeatherReview[]>([]);
  protected weatherRecords = signal<WeatherRecord[]>([]);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal('');
  protected weatherId = '';
  protected rating = '';
  protected comment = '';
  protected feedback = signal('');

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getWeatherReviews().subscribe({
      next: (response) => {
        this.reviews.set(response.weather_reviews);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load reviews.'));
        this.loading.set(false);
      },
    });
    this.api.getWeatherRecords({ page: 1, per_page: 100 }).subscribe({
      next: (response) => this.weatherRecords.set(response.data),
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load weather records for a review.'));
      },
    });
  }

  protected weatherLocation(review: WeatherReview): string {
    return [review.location_name, review.country].filter(Boolean).join(', ') || 'weather record';
  }

  protected onWeatherChange(event: Event): void {
    this.weatherId = (event.target as HTMLSelectElement).value;
  }

  protected onRatingChange(event: Event): void {
    this.rating = (event.target as HTMLSelectElement).value;
  }

  protected onCommentInput(event: Event): void {
    this.comment = (event.target as HTMLTextAreaElement).value;
  }

  protected submitReview(): void {
    if (!this.weatherId || !this.rating || !this.comment.trim()) {
      this.feedback.set('Select a weather record, rating, and review to continue.');
      return;
    }

    this.saving.set(true);
    this.feedback.set('');
    this.api.createWeatherReview(this.weatherId, {
      comment: this.comment.trim(),
      rating: Number(this.rating),
    }).subscribe({
      next: (response) => {
        const record = this.weatherRecords().find((item) => item._id === this.weatherId);
        this.reviews.update((reviews) => [...reviews, {
          ...response.weather_review,
          weather_id: this.weatherId,
          country: record?.country,
          location_name: record?.location_name,
        }]);
        this.feedback.set('Review submitted.');
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to submit this review.'));
        this.saving.set(false);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
