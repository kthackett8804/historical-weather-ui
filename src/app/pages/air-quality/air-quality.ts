import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { AirQualityReading } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-air-quality',
  imports: [FormsModule],
  template: `
    <section aria-labelledby="air-quality-title">
      <h1 id="air-quality-title">Air Quality</h1>
      @if (loading()) {
        <p role="status">Loading air-quality readings...</p>
      } @else if (error()) {
        <p role="alert">{{ error() }}</p>
      } @else if (readings().length) {
        <ul aria-label="Air-quality readings">
          @for (reading of readings(); track reading._id) {
            <li><strong>{{ reading.name }}</strong> · {{ reading.type }} · {{ reading.value }}</li>
          }
        </ul>
      } @else {
        <p role="status">No air-quality readings are available for this weather record.</p>
      }

      @if (weatherId) {
        <section aria-labelledby="reading-form-title">
          <h2 id="reading-form-title">Add an air-quality reading</h2>
          <form (ngSubmit)="submitReading()">
            <label for="reading-type">Reading type</label>
            <select id="reading-type" name="type" [ngModel]="type"
              (change)="onTypeChange($event)" required>
              <option value="">Select a type</option>
              <option value="pollutant">Pollutant</option>
              <option value="index">Index</option>
            </select>

            <label for="reading-name">Name</label>
            <input id="reading-name" name="name" type="text" [ngModel]="name"
              (input)="onNameInput($event)" required />

            <label for="reading-value">Value</label>
            <input id="reading-value" name="value" type="number" min="0" step="any"
              [ngModel]="value" (input)="onValueInput($event)" required />
            <button type="submit" [disabled]="saving()">Save reading</button>
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
    input, select, button { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    .form-feedback { margin: 0; }
  `,
})
export class AirQuality implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly weatherId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  protected readings = signal<AirQualityReading[]>([]);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal('');
  protected type: '' | 'pollutant' | 'index' = '';
  protected name = '';
  protected value = '';
  protected feedback = signal('');

  ngOnInit(): void {
    if (!this.weatherId) {
      this.error.set('Select a weather record to see its air-quality readings.');
      return;
    }

    this.loading.set(true);
    this.api.getAirQualityReadings(this.weatherId).subscribe({
      next: (response) => {
        this.readings.set(response.air_quality_readings);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load air-quality readings.'));
        this.loading.set(false);
      },
    });
  }

  protected onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.type = value === 'pollutant' || value === 'index' ? value : '';
  }

  protected onNameInput(event: Event): void {
    this.name = (event.target as HTMLInputElement).value;
  }

  protected onValueInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
  }

  protected submitReading(): void {
    const readingValue = Number(this.value);
    if (!this.weatherId || !this.type || !this.name.trim() || !this.value ||
        !Number.isFinite(readingValue) || readingValue < 0) {
      this.feedback.set('Enter a type, name, and valid non-negative value to continue.');
      return;
    }

    this.saving.set(true);
    this.feedback.set('');
    this.api.createAirQualityReading(this.weatherId, {
      type: this.type,
      name: this.name.trim(),
      value: readingValue,
    }).subscribe({
      next: (response) => {
        this.readings.update((readings) => [...readings, response.air_quality_reading]);
        this.feedback.set('Reading saved.');
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to save this reading.'));
        this.saving.set(false);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
