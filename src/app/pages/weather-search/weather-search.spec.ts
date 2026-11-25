import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { WeatherSearch } from './weather-search';

describe('WeatherSearch', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherSearch],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('searches weather records using the entered country and condition filters', () => {
    const fixture = TestBed.createComponent(WeatherSearch);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Weather Search');
    const countries = fixture.nativeElement.querySelector('#countries') as HTMLInputElement;
    const condition = fixture.nativeElement.querySelector('#condition') as HTMLInputElement;
    countries.value = 'Iceland, Canada';
    countries.dispatchEvent(new Event('input'));
    condition.value = 'Partly cloudy';
    condition.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    const request = TestBed.inject(HttpTestingController).expectOne(
      (req) =>
        req.url === '/api/v1.0/global-weather-data/search' &&
        req.params.get('countries') === 'Iceland, Canada' &&
        req.params.get('condition_text') === 'Partly cloudy',
    );
    request.flush({
      data: [],
      page: 1,
      per_page: 10,
      total_pages: 0,
      total_count: 0,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No weather records found');
  });
});
