import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SAMPLE_REVIEWS, SAMPLE_WEATHER } from '../../weather-samples';

@Component({
  selector: 'app-reviews',
  imports: [FormsModule, RouterLink],
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

      <section aria-labelledby="review-form-title" class="review-form-section">
        <h2 id="review-form-title">Add a review</h2>
        <form (ngSubmit)="submitReview()" #reviewForm="ngForm">
          <label for="review-weather">Weather record</label>
          <select
            id="review-weather"
            name="weatherId"
            [ngModel]="weatherId"
            (change)="onWeatherChange($event)"
            required
          >
            <option value="">Select a weather record</option>
            @for (record of weatherRecords; track record.id) {
              <option [value]="record.id">{{ record.location }}, {{ record.country }}</option>
            }
          </select>

          <label for="review-rating">Rating</label>
          <select
            id="review-rating"
            name="rating"
            [ngModel]="rating"
            (change)="onRatingChange($event)"
            required
          >
            <option value="">Select a rating</option>
            <option value="1">1 star</option>
            <option value="2">2 stars</option>
            <option value="3">3 stars</option>
            <option value="4">4 stars</option>
            <option value="5">5 stars</option>
          </select>

          <label for="review-comment">Review</label>
          <textarea
            id="review-comment"
            name="comment"
            rows="4"
            [ngModel]="comment"
            (input)="onCommentInput($event)"
            required
          ></textarea>
          <button type="submit">Submit review</button>
          <p class="form-feedback" role="status" aria-live="polite">{{ feedback }}</p>
        </form>
      </section>
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
    .review-form-section {
      max-width: 32rem;
      margin-block: 1.5rem;
    }
    form {
      display: grid;
      gap: 0.75rem;
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
    .form-feedback {
      margin: 0;
    }
  `,
})
export class Reviews {
  protected readonly reviews = SAMPLE_REVIEWS;
  protected readonly weatherRecords = SAMPLE_WEATHER;
  protected weatherId = '';
  protected rating = '';
  protected comment = '';
  protected feedback = '';

  protected weatherLocation(weatherId: string): string {
    const record = SAMPLE_WEATHER.find((item) => item.id === weatherId);
    return record ? `${record.location}, ${record.country}` : 'weather record';
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
      this.feedback = 'Select a weather record, rating, and review to continue.';
      return;
    }

    this.feedback = 'Reviews are not connected in this preview. Your review was not saved.';
  }
}
