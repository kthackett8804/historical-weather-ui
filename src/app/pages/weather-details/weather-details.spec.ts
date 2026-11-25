import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import type { WeatherRecord, WeatherReview } from '../../models';
import { ApiService } from '../../services/api.service';
import { WeatherDetails } from './weather-details';

const weatherRecord = {
  _id: 'weather-1',
  country: 'Canada',
  location_name: 'Vancouver',
  last_updated: '2026-11-25T10:00:00Z',
  condition_text: 'Partly cloudy',
  temperature_celsius: 12,
  precip_mm: 0,
} as WeatherRecord;

const weatherReview: WeatherReview = {
  _id: 'review-1',
  username: 'Maya Chen',
  comment: 'Clear skies in the afternoon.',
  rating: 5,
  favourite_location: false,
};

describe('WeatherDetails', () => {
  let apiServiceSpy: {
    getWeatherRecord: ReturnType<typeof vi.fn>;
    getWeatherRecordReviews: ReturnType<typeof vi.fn>;
    createWeatherReview: ReturnType<typeof vi.fn>;
  };

  async function configure(weatherId: string | null): Promise<void> {
    apiServiceSpy = {
      getWeatherRecord: vi.fn().mockReturnValue(of({ weather: weatherRecord })),
      getWeatherRecordReviews: vi.fn().mockReturnValue(of({ weather_reviews: [weatherReview] })),
      createWeatherReview: vi.fn().mockReturnValue(of({
        weather_review: { ...weatherReview, _id: 'review-2' },
      })),
    };

    await TestBed.configureTestingModule({
      imports: [WeatherDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(weatherId ? { id: weatherId } : {}) },
          },
        },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    }).compileComponents();
  }

  it('loads the selected record and its reviews from the API', async () => {
    await configure('weather-1');
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    expect(apiServiceSpy.getWeatherRecord).toHaveBeenCalledWith('weather-1');
    expect(apiServiceSpy.getWeatherRecordReviews).toHaveBeenCalledWith('weather-1');
    expect(fixture.nativeElement.textContent).toContain('Vancouver, Canada');
    expect(fixture.nativeElement.textContent).toContain('Partly cloudy');
    expect(fixture.nativeElement.textContent).toContain('Maya Chen');
    expect(
      fixture.nativeElement.querySelector('a[href="/weather/weather-1/air-quality"]'),
    ).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('a[href="/weather/weather-1/astronomical-events"]'),
    ).not.toBeNull();
  });

  it('submits a validated review and displays the saved API result', async () => {
    await configure('weather-1');
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    const rating = fixture.nativeElement.querySelector('#rating') as HTMLSelectElement;
    const review = fixture.nativeElement.querySelector('#review-text') as HTMLTextAreaElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(rating.required).toBe(true);
    expect(review.required).toBe(true);
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.review-feedback')?.textContent).toContain(
      'Enter a rating and review',
    );

    rating.value = '5';
    rating.dispatchEvent(new Event('change'));
    review.value = 'Clear skies in the afternoon.';
    review.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy.createWeatherReview).toHaveBeenCalledWith('weather-1', {
      rating: 5,
      comment: 'Clear skies in the afternoon.',
    });
    expect(fixture.nativeElement.querySelector('.review-feedback')?.textContent).toContain(
      'Your review was submitted',
    );
    expect(fixture.nativeElement.querySelectorAll('li')).toHaveLength(2);
  });

  it('does not request data or show the review form without a weather ID', async () => {
    await configure(null);
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    expect(apiServiceSpy.getWeatherRecord).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(
      'Review form is unavailable until a weather record is selected',
    );
  });
});
