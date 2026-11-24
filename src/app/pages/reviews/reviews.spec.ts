import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Reviews } from './reviews';

describe('Reviews', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reviews],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders sample reviews with links to their weather records', () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Reviews');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'sample reviews',
    );
    const links = fixture.nativeElement.querySelectorAll(
      'a[href^="/weather/"]',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]?.getAttribute('href')).toBe('/weather/weather-1');
    expect(fixture.nativeElement.textContent).toContain('Maya Chen');
  });

  it('provides a locally validated form for adding a review', async () => {
    const fixture = TestBed.createComponent(Reviews);
    fixture.detectChanges();

    const weather = fixture.nativeElement.querySelector('#review-weather') as HTMLSelectElement;
    const rating = fixture.nativeElement.querySelector('#review-rating') as HTMLSelectElement;
    const comment = fixture.nativeElement.querySelector('#review-comment') as HTMLTextAreaElement;
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(weather.required).toBe(true);
    expect(rating.required).toBe(true);
    expect(comment.required).toBe(true);

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Select a weather record, rating, and review',
    );

    weather.value = 'weather-1';
    weather.dispatchEvent(new Event('change', { bubbles: true }));
    rating.value = '5';
    rating.dispatchEvent(new Event('change', { bubbles: true }));
    comment.value = 'Clear skies in the afternoon.';
    comment.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.form-feedback')?.textContent).toContain(
      'Your review was not saved',
    );
  });
});
