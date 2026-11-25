import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type {
  FavouriteWeatherRecord,
  MonthlyWeatherTrend,
  WeatherRecord,
} from '../../models';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  template: `
    <section aria-labelledby="dashboard-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="dashboard-title">Dashboard</h1>
      </header>

      <section aria-labelledby="summary-title">
        <h2 id="summary-title">Summary</h2>
        @if (loading()) {
          <p role="status">Loading dashboard weather data...</p>
        } @else if (error()) {
          <p role="alert">{{ error() }}</p>
        } @else if (latestRecord(); as record) {
          <div class="summary-grid">
            <article><h3>Weather records</h3><p>{{ totalCount() }}</p></article>
            <article><h3>Latest location</h3>
              <p>{{ record.location_name }}, {{ record.country }}</p></article>
            <article><h3>Latest temperature</h3>
              <p>{{ record.temperature_celsius }}°C · {{ record.condition_text }}</p></article>
          </div>
        } @else {
          <p role="status">No weather records are available.</p>
        }
      </section>

      <section aria-labelledby="trends-title">
        <h2 id="trends-title">Monthly Trends</h2>
        @if (trendLoading()) {
          <p role="status">Loading monthly trends...</p>
        } @else if (trendError()) {
          <p role="alert">{{ trendError() }}</p>
        } @else if (trends().length) {
          <ul>@for (trend of trends(); track trend.year + '-' + trend.month) {
            <li>{{ trend.year }}-{{ trend.month }} · {{ trend.avg_temperature }}°C average,
              {{ trend.total_precipitation_mm }} mm precipitation</li>
          }</ul>
        } @else {
          <p>No monthly trend data is available for the latest record’s country.</p>
        }
      </section>

      <section aria-labelledby="favourites-title">
        <h2 id="favourites-title">Favourite Locations</h2>
        @if (favouritesLoading()) {
          <p role="status">Loading favourite weather...</p>
        } @else if (favouritesError()) {
          <p role="alert">{{ favouritesError() }}</p>
        } @else if (favourites().length) {
          <ul>@for (favourite of favourites(); track favourite.country + favourite.location_name) {
            <li>{{ favourite.location_name }}, {{ favourite.country }} ·
              {{ favourite.temperature_celsius }}°C · {{ favourite.condition_text }}</li>
          }</ul>
        } @else if (!hasSession()) {
          <p>Sign in to see weather for your favourite locations.</p>
        } @else {
          <p>No favourite locations yet.</p>
        }
      </section>
    </section>
  `,
  styles: `
    :host { display: block; }
    .page-heading { margin-bottom: 2rem; }
    .eyebrow { margin: 0 0 0.25rem; color: #536b87; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; }
    h1 { margin: 0 0 0.5rem; }
    h2 { margin: 0 0 1rem; font-size: 1.25rem; }
    h3 { margin: 0; font-size: 1rem; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: 1rem; }
    article, li { margin: 0; padding: 1rem; border: 1px solid #d7e0ed; background: white; }
    article p { margin: 0.75rem 0 0; color: #536b87; }
    section + section { margin-top: 2rem; }
    ul { display: grid; gap: 0.75rem; padding: 0; list-style: none; }
  `,
})
export class Home implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(ApiAuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected latestRecord = signal<WeatherRecord | null>(null);
  protected totalCount = signal(0);
  protected loading = signal(false);
  protected error = signal('');
  protected trends = signal<MonthlyWeatherTrend[]>([]);
  protected trendLoading = signal(false);
  protected trendError = signal('');
  protected favourites = signal<FavouriteWeatherRecord[]>([]);
  protected favouritesLoading = signal(false);
  protected favouritesError = signal('');
  protected hasSession = signal(false);

  ngOnInit(): void {
    this.loadWeatherSummary();
    this.auth.session$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((session) => {
      this.hasSession.set(session !== null);
      if (session) this.loadFavouriteWeather();
      else {
        this.favourites.set([]);
        this.favouritesLoading.set(false);
      }
    });
  }

  private loadWeatherSummary(): void {
    this.loading.set(true);
    this.api.getWeatherRecords({ page: 1, per_page: 20, sort_by: 'date', order: 'desc' }).subscribe({
      next: (response) => {
        this.latestRecord.set(response.data[0] ?? null);
        this.totalCount.set(response.total_count);
        this.loading.set(false);
        const country = response.data[0]?.country;
        if (country) this.loadMonthlyTrend(country);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load dashboard weather data.'));
        this.loading.set(false);
      },
    });
  }

  private loadMonthlyTrend(country: string): void {
    this.trendLoading.set(true);
    this.api.getMonthlyTrend(country).subscribe({
      next: (response) => {
        this.trends.set(response.monthly_trend);
        this.trendLoading.set(false);
      },
      error: (error: unknown) => {
        this.trendError.set(this.errorMessage(error, 'Unable to load monthly weather trends.'));
        this.trendLoading.set(false);
      },
    });
  }

  private loadFavouriteWeather(): void {
    this.favouritesLoading.set(true);
    this.favouritesError.set('');
    this.api.getFavouritesWeather().subscribe({
      next: (response) => {
        this.favourites.set(response.weather_records);
        this.favouritesLoading.set(false);
      },
      error: (error: unknown) => {
        this.favouritesError.set(this.errorMessage(error, 'Unable to load favourite weather.'));
        this.favouritesLoading.set(false);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
