import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-air-quality',
  imports: [FormsModule],
  template: `
    <section aria-labelledby="air-quality-title">
      <h1 id="air-quality-title">Air Quality</h1>
      <p role="status">No air-quality readings are available in this preview.</p>
      <section aria-labelledby="reading-form-title">
        <h2 id="reading-form-title">Add or update an air-quality reading</h2>
        <form (ngSubmit)="submitReading()">
          <label for="reading-type">Reading type</label>
          <select
            id="reading-type"
            name="type"
            [ngModel]="type"
            (change)="onTypeChange($event)"
            required
          >
            <option value="">Select a type</option>
            <option value="pollutant">Pollutant</option>
            <option value="index">Index</option>
          </select>

          <label for="reading-name">Name</label>
          <input
            id="reading-name"
            name="name"
            type="text"
            [ngModel]="name"
            (input)="onNameInput($event)"
            required
          />

          <label for="reading-value">Value</label>
          <input
            id="reading-value"
            name="value"
            type="number"
            min="0"
            step="any"
            [ngModel]="value"
            (input)="onValueInput($event)"
            required
          />
          <button type="submit">Save reading</button>
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
export class AirQuality {
  protected type: '' | 'pollutant' | 'index' = '';
  protected name = '';
  protected value = '';
  protected feedback = '';

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
    if (!this.type || !this.name.trim() || !this.value || !Number.isFinite(readingValue) || readingValue < 0) {
      this.feedback = 'Enter a type, name, and valid non-negative value to continue.';
      return;
    }

    this.feedback = 'Air-quality readings are not connected in this preview. Your reading was not saved.';
  }
}
