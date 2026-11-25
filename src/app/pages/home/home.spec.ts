import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';
import { Home } from './home';

describe('Home', () => {
  let apiServiceSpy: {
    getWeatherRecords: ReturnType<typeof vi.fn>;
    getMonthlyTrend: ReturnType<typeof vi.fn>;
    getFavouritesWeather: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getWeatherRecords: vi.fn().mockReturnValue(of({
        data: [{ _id: 'weather-1', country: 'Canada', location_name: 'Vancouver',
          last_updated: '2026-11-25', temperature_celsius: 12, condition_text: 'Cloudy' }],
        page: 1, per_page: 20, total_pages: 1, total_count: 81,
      })),
      getMonthlyTrend: vi.fn().mockReturnValue(of({
        monthly_trend: [{ year: 2026, month: 11, avg_temperature: 8,
          total_precipitation_mm: 12, avg_humidity: 70 }],
      })),
      getFavouritesWeather: vi.fn().mockReturnValue(of({
        count: 1,
        weather_records: [{ country: 'Canada', location_name: 'Vancouver',
          last_updated: '2026-11-25', temperature_celsius: 12,
          condition_text: 'Cloudy', humidity: 70, wind_kph: 10,
          precip_mm: 0, uv_index: 2 }],
      })),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ApiAuthService, useValue: { session$: of({ user_id: 'user-1' }) } },
      ],
    }).compileComponents();
  });

  it('loads dashboard summaries, trends, and favourite weather from the API', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    expect(apiServiceSpy.getWeatherRecords).toHaveBeenCalled();
    expect(apiServiceSpy.getMonthlyTrend).toHaveBeenCalledWith('Canada');
    expect(apiServiceSpy.getFavouritesWeather).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('81');
    expect(fixture.nativeElement.textContent).toContain('Vancouver, Canada');
    expect(fixture.nativeElement.textContent).toContain('2026-11');
    expect(fixture.nativeElement.textContent).toContain('12°C');
  });
});
