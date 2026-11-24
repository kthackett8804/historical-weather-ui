import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-astronomical-events',
  imports: [FormsModule],
  template: `
    <section aria-labelledby="events-title">
      <h1 id="events-title">Astronomical Events</h1>
      <p role="status">No astronomical events are available in this preview.</p>
      <section aria-labelledby="event-form-title">
        <h2 id="event-form-title">Add or update an astronomical event</h2>
        <form (ngSubmit)="submitEvent()">
          <label for="event-name">Event</label>
          <input
            id="event-name"
            name="event"
            type="text"
            [ngModel]="eventName"
            (input)="onEventNameInput($event)"
            required
          />

          <label for="event-time">Time</label>
          <input
            id="event-time"
            name="time"
            type="time"
            [ngModel]="time"
            (input)="onTimeInput($event)"
          />

          <label for="event-occurs">Occurs</label>
          <select
            id="event-occurs"
            name="occurs"
            [ngModel]="occurs"
            (change)="onOccursChange($event)"
          >
            <option value="">Not specified</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <button type="submit">Save event</button>
          <p class="form-feedback" role="status" aria-live="polite">{{ feedback }}</p>
        </form>
      </section>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 32rem;
      margin-block: 1.5rem;
    }
    input,
    select,
    button {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
    }
    .form-feedback {
      margin: 0;
    }
  `,
})
export class AstronomicalEvents {
  protected eventName = '';
  protected time = '';
  protected occurs: '' | 'true' | 'false' = '';
  protected feedback = '';

  protected onEventNameInput(event: Event): void {
    this.eventName = (event.target as HTMLInputElement).value;
  }

  protected onTimeInput(event: Event): void {
    this.time = (event.target as HTMLInputElement).value;
  }

  protected onOccursChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.occurs = value === 'true' || value === 'false' ? value : '';
  }

  protected submitEvent(): void {
    if (!this.eventName.trim()) {
      this.feedback = 'Enter an event name to continue.';
      return;
    }

    this.feedback = 'Astronomical events are not connected in this preview. Your event was not saved.';
  }
}
