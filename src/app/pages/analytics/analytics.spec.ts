import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from '../../services/api.service';
import { Analytics } from './analytics';

describe('Analytics', () => {
  let apiServiceSpy: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    apiServiceSpy = {
      getExtremeWeather: vi.fn().mockReturnValue(of({
        hottest: [], coldest: [], windiest: [], highest_uv: [], limit: 10,
      })),
      getAirQualityRanking: vi.fn().mockReturnValue(of({
        index: 'us-epa-index', order: 'desc', ranking: [{ rank: 1, country: 'Canada', avg_aqi: 2, readings: 4 }],
      })),
      getReviewStats: vi.fn().mockReturnValue(of({
        min_reviews: 0, count: 0, locations: [],
      })),
      getDaylightHours: vi.fn().mockReturnValue(of({
        group_by: 'country', exclude_anomalies: true, daylight_hours: [],
      })),
      getCountrySummary: vi.fn().mockReturnValue(of([{
        country: 'Iceland', avg_temperature: 4, min_temperature: -2, max_temperature: 9,
        avg_humidity: 70, avg_wind_speed: 12, distinct_locations: 2,
      }])),
      getMonthlyTrend: vi.fn().mockReturnValue(of({ monthly_trend: [] })),
      getPollutantAverages: vi.fn().mockReturnValue(of({ pollutants: [] })),
      getMoonPhaseDistribution: vi.fn().mockReturnValue(of({
        phase_distribution: [], avg_moon_illumination: 50,
        astronomical_event_occurs: { true: 1, false: 0, null: 0 },
      })),
    };

    await TestBed.configureTestingModule({
      imports: [Analytics],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();
  });

  it('loads global analytics from the API', () => {
    const fixture = TestBed.createComponent(Analytics);
    fixture.detectChanges();

    expect(apiServiceSpy['getExtremeWeather']).toHaveBeenCalled();
    expect(apiServiceSpy['getAirQualityRanking']).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Canada');
    expect(fixture.nativeElement.textContent).toContain('Air Quality Ranking');
  });

  it('requests country-specific analytics using the selected country', () => {
    const fixture = TestBed.createComponent(Analytics);
    fixture.detectChanges();

    const country = fixture.nativeElement.querySelector('#analytics-country') as HTMLInputElement;
    country.value = 'Iceland';
    country.dispatchEvent(new Event('input'));
    (fixture.nativeElement.querySelector('form') as HTMLFormElement)
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy['getCountrySummary']).toHaveBeenCalledWith('Iceland');
    expect(apiServiceSpy['getMonthlyTrend']).toHaveBeenCalledWith('Iceland');
    expect(apiServiceSpy['getPollutantAverages']).toHaveBeenCalledWith('Iceland');
    expect(apiServiceSpy['getMoonPhaseDistribution']).toHaveBeenCalledWith('Iceland');
    expect(fixture.nativeElement.textContent).toContain('Average temperature: 4°C');
  });
});
