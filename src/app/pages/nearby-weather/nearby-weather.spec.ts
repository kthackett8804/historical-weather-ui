import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NearbyWeather } from './nearby-weather';

describe('NearbyWeather', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyWeather],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('sends valid coordinates to the nearby weather endpoint', () => {
    const fixture = TestBed.createComponent(NearbyWeather);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Nearby Weather');
    const latitude = fixture.nativeElement.querySelector('#latitude') as HTMLInputElement;
    latitude.value = '64.1';
    latitude.dispatchEvent(new Event('input'));
    const longitude = fixture.nativeElement.querySelector('#longitude') as HTMLInputElement;
    longitude.value = '-21.9';
    longitude.dispatchEvent(new Event('input'));
    const distance = fixture.nativeElement.querySelector('#distance') as HTMLInputElement;
    distance.value = '50';
    distance.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    const request = TestBed.inject(HttpTestingController).expectOne(
      (req) =>
        req.url === '/api/v1.0/global-weather-data/nearby-locations' &&
        req.params.get('latitude') === '64.1' &&
        req.params.get('longitude') === '-21.9' &&
        req.params.get('max_distance_km') === '50',
    );
    request.flush({ weather_records: [] });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No nearby weather records found');
  });
});
