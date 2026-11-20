import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-weather-details',
  template: `
    <section aria-labelledby="details-title">
      <h1 id="details-title">Weather Details</h1>
      <p role="status">No weather record is loaded in this preview.</p>
      <section aria-labelledby="reviews-title">
        <h2 id="reviews-title">Reviews</h2>
        <p>No reviews are available for this record.</p>
        @if (weatherId) {
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
export class WeatherDetails {
  protected readonly weatherId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  protected rating = '';
  protected reviewText = '';
  protected feedback = '';

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
