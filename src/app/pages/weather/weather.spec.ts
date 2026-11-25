import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Weather } from './weather';

describe('Weather', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Weather],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('renders API weather records with links to their detail pages', async () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();
    httpTestingController
      .expectOne((req) => req.url === '/api/v1.0/global-weather-data')
      .flush({
      data: [
        {
          _id: 'weather-1',
          location_name: 'Vancouver',
          country: 'Canada',
          last_updated: '2026-03-10',
          condition_text: 'Partly cloudy',
          temperature_celsius: 12,
          precip_mm: 0.2,
        },
      ],
      page: 1,
      per_page: 10,
      total_pages: 1,
      total_count: 1,
      });
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Weather Explorer');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      '1 weather record',
    );
    const links = fixture.nativeElement.querySelectorAll(
      'a[href^="/weather/"]',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]?.getAttribute('href')).toBe('/weather/weather-1');
  });

  it('sends location and country filters to the API', async () => {
    const fixture = TestBed.createComponent(Weather);
    fixture.detectChanges();
    httpTestingController
      .expectOne((req) => req.url === '/api/v1.0/global-weather-data')
      .flush({
      data: [],
      page: 1,
      per_page: 10,
      total_pages: 0,
      total_count: 0,
      });
    fixture.detectChanges();

    const location = fixture.nativeElement.querySelector('#location') as HTMLInputElement;
    location.value = 'Reykjavik';
    location.dispatchEvent(new Event('input'));
    const country = fixture.nativeElement.querySelector('#country') as HTMLInputElement;
    country.value = 'Iceland';
    country.dispatchEvent(new Event('input'));
    const sort = fixture.nativeElement.querySelector('#sort') as HTMLSelectElement;
    sort.value = 'oldest';
    sort.dispatchEvent(new Event('change'));
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const request = httpTestingController.expectOne(
      (req) =>
        req.url === '/api/v1.0/global-weather-data' &&
        req.params.get('location_name') === 'Reykjavik' &&
        req.params.get('country') === 'Iceland' &&
        req.params.get('order') === 'asc',
    );
    request.flush({ data: [], page: 1, per_page: 10, total_pages: 0, total_count: 0 });
    await fixture.whenStable();
  });
});
