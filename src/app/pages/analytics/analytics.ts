import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import type {
  AirQualityRankingResponse,
  CountrySummary,
  DaylightHoursEntry,
  ExtremeWeatherResponse,
  MoonPhaseDistributionResponse,
  MonthlyWeatherTrend,
  PollutantAverage,
  ReviewStatsResponse,
} from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-analytics',
  imports: [FormsModule],
  template: `
    <section aria-labelledby="analytics-title">
      <header class="page-heading">
        <p class="eyebrow">WEATHER ATLAS</p>
        <h1 id="analytics-title">Analytics</h1>
      </header>

      <section aria-labelledby="country-summary-title">
        <h2 id="country-summary-title">Country Summary</h2>
        <form (ngSubmit)="loadCountryAnalytics()">
          <label for="analytics-country">Country</label>
          <input id="analytics-country" name="country" type="text" required
            [ngModel]="country" (input)="onCountryInput($event)" />
          <button type="submit" [disabled]="countryLoading()">Load country analytics</button>
        </form>
        @if (countryLoading()) {
          <p role="status">Loading country analytics...</p>
        } @else if (countryError()) {
          <p role="alert">{{ countryError() }}</p>
        } @else if (summary(); as result) {
          <p>{{ result.country }} · {{ result.distinct_locations }} locations</p>
          <p>Average temperature: {{ result.avg_temperature }}°C
            ({{ result.min_temperature }}°C to {{ result.max_temperature }}°C)</p>
          <p>Average humidity: {{ result.avg_humidity }}% ·
            average wind: {{ result.avg_wind_speed }} km/h</p>
          <h3>Monthly trends</h3>
          @if (monthlyTrend().length) {
            <ul>
              @for (month of monthlyTrend(); track month.year + '-' + month.month) {
                <li>{{ month.year }}-{{ month.month }}: {{ month.avg_temperature }}°C average,
                  {{ month.total_precipitation_mm }} mm precipitation</li>
              }
            </ul>
          } @else {
            <p>No monthly trend data available for this country.</p>
          }
          <h3>Pollutant averages</h3>
          @if (pollutants().length) {
            <ul>@for (pollutant of pollutants(); track pollutant.pollutant) {
              <li>{{ pollutant.pollutant }}: {{ pollutant.avg_value }} ({{ pollutant.readings }} readings)</li>
            }</ul>
          } @else {
            <p>No pollutant readings available for this country.</p>
          }
          @if (moonPhases(); as phases) {
            <h3>Moon and astronomical summary</h3>
            <p>Average moon illumination: {{ phases.avg_moon_illumination }}%</p>
            <p>Recorded event occurrences: {{ phases.astronomical_event_occurs['true'] }} occur,
              {{ phases.astronomical_event_occurs['false'] }} do not occur,
              {{ phases.astronomical_event_occurs['null'] }} unspecified</p>
            <ul>@for (phase of phases.phase_distribution; track phase.moon_phase) {
              <li>{{ phase.moon_phase }}: {{ phase.count }} records,
                {{ phase.avg_illumination }}% average illumination</li>
            }</ul>
          }
        } @else {
          <p>Choose a country to load country-specific analytics.</p>
        }
      </section>

      <section aria-labelledby="extreme-weather-title">
        <h2 id="extreme-weather-title">Extreme Weather</h2>
        @if (globalLoading()) {
          <p role="status">Loading analytics...</p>
        } @else if (globalError()) {
          <p role="alert">{{ globalError() }}</p>
        } @else if (extremes(); as data) {
          <h3>Hottest locations</h3>
          <ul>@for (record of data.hottest; track record.country + record.location_name) {
            <li>{{ record.location_name }}, {{ record.country }} · {{ record.temperature_celsius }}°C</li>
          }</ul>
          <h3>Coldest locations</h3>
          <ul>@for (record of data.coldest; track record.country + record.location_name) {
            <li>{{ record.location_name }}, {{ record.country }} · {{ record.temperature_celsius }}°C</li>
          }</ul>
          <h3>Windiest locations</h3>
          <ul>@for (record of data.windiest; track record.country + record.location_name) {
            <li>{{ record.location_name }}, {{ record.country }} · {{ record.wind_kph }} km/h</li>
          }</ul>
          <h3>Highest UV</h3>
          <ul>@for (record of data.highest_uv; track record.country + record.location_name) {
            <li>{{ record.location_name }}, {{ record.country }} · UV {{ record.uv_index }}</li>
          }</ul>
        }
      </section>

      <section aria-labelledby="air-ranking-title">
        <h2 id="air-ranking-title">Air Quality Ranking</h2>
        @if (ranking(); as data) {
          <p>Index: {{ data.index }} · ordered {{ data.order === 'desc' ? 'highest first' : 'lowest first' }}</p>
          <ol>@for (entry of data.ranking; track entry.country) {
            <li>{{ entry.country }}: average index {{ entry.avg_aqi }} ({{ entry.readings }} readings)</li>
          }</ol>
        } @else if (!globalLoading() && !globalError()) {
          <p>No air-quality ranking data available.</p>
        }
      </section>

      <section aria-labelledby="review-stats-title">
        <h2 id="review-stats-title">Review Statistics</h2>
        @if (reviewStats(); as stats) {
          @if (stats.locations.length) {
            <ul>@for (location of stats.locations; track location.country + location.location_name) {
              <li>{{ location.location_name }}, {{ location.country }}:
                {{ location.avg_rating }}/5 from {{ location.total_reviews }} reviews</li>
            }</ul>
          } @else {
            <p>No review statistics available.</p>
          }
        }
      </section>

      <section aria-labelledby="daylight-title">
        <h2 id="daylight-title">Daylight Hours by Country</h2>
        @if (daylight().length) {
          <ul>@for (entry of daylight(); track entry.country || entry.year + '-' + entry.month) {
            <li>{{ entry.country || (entry.year + '-' + entry.month) }}:
              {{ entry.avg_daylight_hours }} hours average</li>
          }</ul>
        } @else if (!globalLoading() && !globalError()) {
          <p>No daylight data available.</p>
        }
      </section>
    </section>
  `,
  styles: `
    :host { display: block; }
    .page-heading { margin-bottom: 2rem; }
    .eyebrow { margin: 0 0 0.25rem; color: #536b87; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; }
    section + section { margin-top: 1.5rem; padding: 1rem; border: 1px solid #d7e0ed; background: white; }
    form { display: grid; gap: 0.75rem; max-width: 32rem; margin-block: 1rem; }
    input, button { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    ul, ol { display: grid; gap: 0.5rem; }
  `,
})
export class Analytics implements OnInit {
  private readonly api = inject(ApiService);
  protected country = '';
  protected countryLoading = signal(false);
  protected countryError = signal('');
  protected summary = signal<CountrySummary | null>(null);
  protected monthlyTrend = signal<MonthlyWeatherTrend[]>([]);
  protected pollutants = signal<PollutantAverage[]>([]);
  protected moonPhases = signal<MoonPhaseDistributionResponse | null>(null);
  protected globalLoading = signal(true);
  protected globalError = signal('');
  protected extremes = signal<ExtremeWeatherResponse | null>(null);
  protected ranking = signal<AirQualityRankingResponse | null>(null);
  protected reviewStats = signal<ReviewStatsResponse | null>(null);
  protected daylight = signal<DaylightHoursEntry[]>([]);

  ngOnInit(): void {
    forkJoin({
      extremes: this.api.getExtremeWeather(),
      ranking: this.api.getAirQualityRanking(),
      reviews: this.api.getReviewStats(),
      daylight: this.api.getDaylightHours(),
    }).subscribe({
      next: (response) => {
        this.extremes.set(response.extremes);
        this.ranking.set(response.ranking);
        this.reviewStats.set(response.reviews);
        this.daylight.set(response.daylight.daylight_hours);
        this.globalLoading.set(false);
      },
      error: (error: unknown) => {
        this.setGlobalError(error, 'Unable to load global analytics.');
      },
    });
  }

  protected onCountryInput(event: Event): void {
    this.country = (event.target as HTMLInputElement).value;
  }

  protected loadCountryAnalytics(): void {
    const country = this.country.trim();
    if (!country) {
      this.countryError.set('Enter a country to load its analytics.');
      return;
    }

    this.countryLoading.set(true);
    this.countryError.set('');
    forkJoin({
      summary: this.api.getCountrySummary(country),
      trend: this.api.getMonthlyTrend(country),
      pollutants: this.api.getPollutantAverages(country),
      phases: this.api.getMoonPhaseDistribution(country),
    }).subscribe({
      next: (result) => {
        this.summary.set(result.summary[0] ?? null);
        this.monthlyTrend.set(result.trend.monthly_trend);
        this.pollutants.set(result.pollutants.pollutants);
        this.moonPhases.set(result.phases);
        this.countryLoading.set(false);
      },
      error: (error: unknown) => {
        this.countryError.set(this.errorMessage(error, 'Unable to load country analytics.'));
        this.countryLoading.set(false);
      },
    });
  }

  private setGlobalError(error: unknown, fallback: string): void {
    this.globalError.set(this.errorMessage(error, fallback));
    this.globalLoading.set(false);
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
