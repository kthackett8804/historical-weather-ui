
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from '../../services/api.service';
import { NearbyWeather } from './nearby-weather';

describe('NearbyWeather', () => {
  let apiServiceSpy: {
    getNearbyWeather: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getNearbyWeather: vi.fn().mockReturnValue(of({
        weather_records: [] as Array<{
          _id: string;
          location_name: string;
          country: string;
          temperature_celsius: number;
          distance_km: number;
        }>,
      })),
    };

    await TestBed.configureTestingModule({
      imports: [NearbyWeather],
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();
  });

  it('displays the nearby weather search form', () => {
    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain(
      'Nearby Weather',
    );
    expect(fixture.nativeElement.querySelector('#latitude')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#longitude')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#distance')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain(
      'Enter coordinates and a distance to search.',
    );
  });

  it('submits valid coordinates to the nearby weather API', () => {
    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    const values: Record<string, string> = {
      '#latitude': '64.1',
      '#longitude': '-21.9',
      '#distance': '50',
    };

    for (const [selector, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(apiServiceSpy.getNearbyWeather).toHaveBeenCalledWith({
      latitude: 64.1,
      longitude: -21.9,
      max_distance_km: 50,
    });
    expect(fixture.nativeElement.textContent).toContain(
      'No nearby weather records found.',
    );
  });

  it('displays nearby weather records returned by the API', () => {
    apiServiceSpy.getNearbyWeather.mockReturnValue(of({
      weather_records: [{
        _id: 'weather-1',
        location_name: 'Reykjavik',
        country: 'Iceland',
        temperature_celsius: 8,
        distance_km: 12.5,
      }],
    }));

    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    const values: Record<string, string> = {
      '#latitude': '64.1',
      '#longitude': '-21.9',
      '#distance': '50',
    };

    for (const [selector, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Reykjavik');
    expect(fixture.nativeElement.textContent).toContain('Iceland');
    expect(fixture.nativeElement.textContent).toContain('8°C');
    expect(fixture.nativeElement.textContent).toContain('12.5 km away');
    expect(fixture.nativeElement.querySelector('a[href="/weather/weather-1"]')).not.toBeNull();
  });

  it('rejects invalid coordinates without calling the API', () => {
    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    const values: Record<string, string> = {
      '#latitude': '91',
      '#longitude': '-21.9',
      '#distance': '50',
    };

    for (const [selector, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(apiServiceSpy.getNearbyWeather).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Enter valid coordinates and a positive maximum distance.',
    );
  });

  it('displays an error when the nearby weather API request fails', () => {
    apiServiceSpy.getNearbyWeather.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            error: { message: 'Unable to retrieve weather data.' },
          }),
      ),
    );

    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    const values: Record<string, string> = {
      '#latitude': '64.1',
      '#longitude': '-21.9',
      '#distance': '50',
    };

    for (const [selector, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }

    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Unable to retrieve weather data.',
    );
  });
});
