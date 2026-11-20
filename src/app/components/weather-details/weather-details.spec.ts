import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { WeatherDetails } from './weather-details';

async function configureWeatherDetails(weatherId: string | null) {
  await TestBed.configureTestingModule({
    imports: [WeatherDetails],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: convertToParamMap(weatherId ? { id: weatherId } : {}) },
        },
      },
    ],
  }).compileComponents();
}

describe('WeatherDetails with a weather ID', () => {
  beforeEach(async () => {
    await configureWeatherDetails('weather-1');
  });

  it('explains that no weather record is loaded', () => {
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Weather Details');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No weather record is loaded',
    );
  });

  it('includes an empty reviews section without fabricated reviews', () => {
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2')?.textContent).toContain('Reviews');
    expect(fixture.nativeElement.textContent).toContain('No reviews are available for this record');
  });

  it('provides required rating and review fields', () => {
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    const rating = fixture.nativeElement.querySelector('#rating') as HTMLSelectElement;
    const review = fixture.nativeElement.querySelector('#review-text') as HTMLTextAreaElement;

    expect(rating.required).toBe(true);
    expect(review.required).toBe(true);
    expect(fixture.nativeElement.querySelector('label[for="rating"]')?.textContent).toContain(
      'Rating',
    );
    expect(fixture.nativeElement.querySelector('label[for="review-text"]')?.textContent).toContain(
      'Review',
    );
  });

  it('validates locally and does not claim the review was saved', () => {
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.review-feedback')?.textContent).toContain(
      'Enter a rating and review',
    );

    const rating = fixture.nativeElement.querySelector('#rating') as HTMLSelectElement;
    rating.value = '5';
    rating.dispatchEvent(new Event('change'));
    const review = fixture.nativeElement.querySelector('#review-text') as HTMLTextAreaElement;
    review.value = 'Clear skies in the afternoon.';
    review.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.review-feedback')?.textContent).toContain(
      'Your review was not saved',
    );
  });
});

describe('WeatherDetails without a weather ID', () => {
  beforeEach(async () => {
    await configureWeatherDetails(null);
  });

  it('does not show the review form without a parent weather ID', () => {
    const fixture = TestBed.createComponent(WeatherDetails);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(
      'Review form is unavailable until a weather record is selected',
    );
  });
});
