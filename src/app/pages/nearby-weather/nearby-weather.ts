import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { WeatherRecord } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-nearby-weather',
  imports: [RouterLink],
  template: `
    <section aria-labelledby="nearby-title">
      <h1 id="nearby-title">Nearby Weather</h1>
      <p role="status" aria-live="polite">
        @if (loading()) {
          Finding nearby weather...
        } @else if (error()) {
          {{ error() }}
        } @else if (hasSearched()) {
          {{ records().length }} nearby weather record{{ records().length === 1 ? '' : 's' }} found.
        } @else {
          Enter coordinates and a distance to search.
        }
      </p>
      <form aria-label="Nearby weather search" (submit)="findNearby($event)">
        <label for="latitude">Latitude</label>
        <input id="latitude" type="number" min="-90" max="90" step="any" required
          [value]="latitude" (input)="onLatitudeInput($event)" />
        <label for="longitude">Longitude</label>
        <input id="longitude" type="number" min="-180" max="180" step="any" required
          [value]="longitude" (input)="onLongitudeInput($event)" />
        <label for="distance">Maximum distance (km)</label>
        <input id="distance" type="number" min="0.1" step="any" required
          [value]="distance" (input)="onDistanceInput($event)" />
        <button type="submit" [disabled]="loading()">Find nearby weather</button>
      </form>
      @if (records().length) {
        <ul>
          @for (record of records(); track record._id) {
            <li>
              <a [routerLink]="['/weather', record._id]">
                <h2>{{ record.location_name }}, {{ record.country }}</h2>
                <p>{{ record.temperature_celsius }}°C · {{ record.distance_km }} km away</p>
              </a>
            </li>
          }
        </ul>
      } @else if (hasSearched() && !loading() && !error()) {
        <p>No nearby weather records found.</p>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    form {
      display: grid;
      gap: 0.75rem;
      max-width: 30rem;
      margin-block: 1.5rem;
    }
    input,
    button {
      min-height: 2.75rem;
      padding: 0.5rem 0.75rem;
      font: inherit;
    }
    ul {
      display: grid;
      gap: 1rem;
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
  `,
})
export class NearbyWeather {
  private readonly api = inject(ApiService);
  protected latitude = '';
  protected longitude = '';
  protected distance = '';
  protected records = signal<Array<WeatherRecord & { distance_km: number }>>([]);
  protected loading = signal(false);
  protected hasSearched = signal(false);
  protected error = signal('');

  protected onLatitudeInput(event: Event): void {
    this.latitude = (event.target as HTMLInputElement).value;
  }

  protected onLongitudeInput(event: Event): void {
    this.longitude = (event.target as HTMLInputElement).value;
  }

  protected onDistanceInput(event: Event): void {
    this.distance = (event.target as HTMLInputElement).value;
  }

  protected findNearby(event: Event): void {
    event.preventDefault();
    const latitude = Number(this.latitude);
    const longitude = Number(this.longitude);
    const maxDistanceKm = Number(this.distance);
    if (
      !this.latitude ||
      !this.longitude ||
      !this.distance ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180 ||
      !Number.isFinite(maxDistanceKm) ||
      maxDistanceKm <= 0
    ) {
      this.error.set('Enter valid coordinates and a positive maximum distance.');
      return;
    }

    this.loading.set(true);
    this.hasSearched.set(true);
    this.error.set('');
    this.api.getNearbyWeather({ latitude, longitude, max_distance_km: maxDistanceKm }).subscribe({
      next: (response) => {
        this.records.set(response.weather_records);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          error instanceof HttpErrorResponse
            ? error.error?.message ?? 'Unable to find nearby weather.'
            : 'Unable to find nearby weather.',
        );
        this.loading.set(false);
      },
    });
  }
}
