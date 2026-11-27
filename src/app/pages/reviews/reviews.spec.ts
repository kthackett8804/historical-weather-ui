import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from '../../services/api.service';
import { Reviews } from './reviews';

describe('Reviews', () => {
  let apiServiceSpy: {
    getWeatherRecords: ReturnType<typeof vi.fn>;
    getWeatherReviews: ReturnType<typeof vi.fn>;
    createWeatherReview: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getWeatherRecords: vi.fn().mockReturnValue(of({
        data: [{ _id: 'weather-1', location_name: 'Vancouver', country: 'Canada' }],
        page: 1, per_page: 100, total_pages: 1, total_count: 1,
      })),
      getWeatherReviews: vi.fn().mockReturnValue(of({
        weather_reviews: [{
          _id: 'review-1', username: 'Maya Chen', comment: 'Clear skies.',
          rating: 5, favourite_location: false,
        }],
      })),
      createWeatherReview: vi.fn().mockReturnValue(of({
        weather_review: {
          _id: 'review-2', username: 'Weather user', comment: 'Clear skies.',
          rating: 5, favourite_location: false,
        },
      })),
    };

    await TestBed.configureTestingModule({
      imports: [Reviews],
      providers: [provideRouter([]), { provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();
  });

  it('loads real reviews and available weather records from the API', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();

    expect(apiServiceSpy.getWeatherReviews).toHaveBeenCalled();
    expect(apiServiceSpy.getWeatherRecords).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Maya Chen');
    expect(fixture.nativeElement.querySelector('a[href="/weather/weather-1"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('#review-weather')?.textContent).toContain('Vancouver');
  });

  it('validates a review then sends it through the API', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();

    const weather = fixture.nativeElement.querySelector('#review-weather') as HTMLSelectElement;
    const rating = fixture.nativeElement.querySelector('#review-rating') as HTMLSelectElement;
    const comment = fixture.nativeElement.querySelector('#review-comment') as HTMLTextAreaElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Select a weather record, rating, and review',
    );

    weather.value = 'weather-1';
    weather.dispatchEvent(new Event('change'));
    rating.value = '5';
    rating.dispatchEvent(new Event('change'));
    comment.value = 'Clear skies in the afternoon.';
    comment.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(apiServiceSpy.createWeatherReview).toHaveBeenCalledWith('weather-1', {
      comment: 'Clear skies in the afternoon.',
      rating: 5,
    });
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Review submitted.',
    );
  });
});
