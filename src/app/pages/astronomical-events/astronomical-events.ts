import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { AstronomicalEvent } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-astronomical-events',
  imports: [DatePipe, FormsModule],
  template: `
    <section aria-labelledby="events-title">
      <h1 id="events-title">Astronomical Events</h1>
      @if (loading()) {
        <p role="status">Loading astronomical events...</p>
      } @else if (error()) {
        <p role="alert">{{ error() }}</p>
      } @else if (events().length) {
        <ul aria-label="Astronomical events">
          @for (event of events(); track event._id) {
            <li>
              <strong>{{ event.event }}</strong>
              <span> · {{ event.time ? (event.time | date: 'medium') : 'Time not recorded' }}</span>
              @if (event.occurs !== null) {
                <span> · {{ event.occurs ? 'Occurs' : 'Does not occur' }}</span>
              }
            </li>
          }
        </ul>
      } @else {
        <p role="status">No astronomical events are available for this weather record.</p>
      }

      @if (weatherId) {
        <section aria-labelledby="event-form-title">
          <h2 id="event-form-title">Add an astronomical event</h2>
          <form (ngSubmit)="submitEvent()">
            <label for="event-name">Event</label>
            <input id="event-name" name="event" type="text" [ngModel]="eventName"
              (input)="onEventNameInput($event)" required />

            <label for="event-time">Time (optional)</label>
            <input id="event-time" name="time" type="time" [ngModel]="time"
              (input)="onTimeInput($event)" />

            <button type="submit" [disabled]="saving()">Save event</button>
            <p class="form-feedback" role="status" aria-live="polite">{{ feedback() }}</p>
          </form>
        </section>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    ul { display: grid; gap: 0.75rem; padding: 0; list-style: none; }
    li { padding: 0.75rem; border: 1px solid #d7e0ed; background: white; }
    form { display: grid; gap: 0.75rem; max-width: 32rem; margin-block: 1.5rem; }
    input, button { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    .form-feedback { margin: 0; }
  `,
})
export class AstronomicalEvents implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly weatherId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  protected events = signal<AstronomicalEvent[]>([]);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal('');
  protected eventName = '';
  protected time = '';
  protected feedback = signal('');

  ngOnInit(): void {
    if (!this.weatherId) {
      this.error.set('Select a weather record to see its astronomical events.');
      return;
    }

    this.loading.set(true);
    this.api.getAstronomicalEvents(this.weatherId).subscribe({
      next: (response) => {
        this.events.set(response.astronomical_events);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load astronomical events.'));
        this.loading.set(false);
      },
    });
  }

  protected onEventNameInput(event: Event): void {
    this.eventName = (event.target as HTMLInputElement).value;
  }

  protected onTimeInput(event: Event): void {
    this.time = (event.target as HTMLInputElement).value;
  }

  protected submitEvent(): void {
    if (!this.weatherId || !this.eventName.trim()) {
      this.feedback.set('Enter an event name to continue.');
      return;
    }

    this.saving.set(true);
    this.feedback.set('');
    this.api.createAstronomicalEvent(this.weatherId, {
      event: this.eventName.trim(),
      time: this.time || null,
    }).subscribe({
      next: (response) => {
        this.events.update((events) => [...events, response.astronomical_event]);
        this.feedback.set('Event saved.');
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to save this event.'));
        this.saving.set(false);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
