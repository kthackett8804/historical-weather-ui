import { TestBed } from '@angular/core/testing';
import { WeatherSearch } from './weather-search';

describe('WeatherSearch', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSearch],
    }).compileComponents();
  });

  it('renders the search heading and unavailable-data notice', () => {
    const fixture = TestBed.createComponent(WeatherSearch);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Weather Search');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Weather data is not connected',
    );
  });

  it('disables search filters and submit control', () => {
    const fixture = TestBed.createComponent(WeatherSearch);
    fixture.detectChanges();

    const controls = fixture.nativeElement.querySelectorAll('input, button') as NodeListOf<
      HTMLInputElement | HTMLButtonElement
    >;

    expect(controls.length).toBeGreaterThan(0);
    expect(Array.from(controls).every((control) => control.disabled)).toBe(true);
  });
});
