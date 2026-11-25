import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('requests typed weather records with supported query parameters', () => {
    service
      .getWeatherRecords({ page: 2, per_page: 10, country: 'Iceland', order: 'desc' })
      .subscribe((response) => {
        expect(response.data).toEqual([]);
        expect(response.total_count).toBe(0);
      });

    const request = httpTestingController.expectOne(
      (req) => req.url === '/api/v1.0/global-weather-data' && req.params.get('page') === '2',
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('per_page')).toBe('10');
    expect(request.request.params.get('country')).toBe('Iceland');
    expect(request.request.params.get('order')).toBe('desc');
    request.flush({ data: [], page: 2, per_page: 10, total_pages: 0, total_count: 0 });
  });

  it('posts the supplied typed review to its weather record', () => {
    service
      .createWeatherReview('record/1', {
        comment: 'Clear skies',
        rating: 5,
        favourite_location: true,
      })
      .subscribe();

    const request = httpTestingController.expectOne(
      '/api/v1.0/global-weather-data/record%2F1/weather-reviews',
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      comment: 'Clear skies',
      rating: 5,
      favourite_location: true,
    });
    request.flush({ weather_review: {} });
  });

  it('exchanges an Auth0 ID token at the backend authentication endpoint', () => {
    service.loginWithAuth0('auth0-id-token').subscribe();

    const request = httpTestingController.expectOne('/api/v1.0/auth0-login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ id_token: 'auth0-id-token' });
    request.flush({
      token: 'application-jwt',
      username: 'weather-user',
      user_id: 'user-id',
      role: 'user',
    });
  });

  it('sends required country filters to country-specific analytics endpoints', () => {
    service.getCountrySummary('Iceland').subscribe((response) => {
      expect(response).toEqual([]);
    });
    const summary = httpTestingController.expectOne(
      (req) => req.url === '/api/v1.0/global-weather-data/country-summary',
    );
    expect(summary.request.params.get('country')).toBe('Iceland');
    summary.flush([]);

    service.getPollutantAverages('Iceland').subscribe((response) => {
      expect(response.pollutants).toEqual([]);
    });
    const pollutants = httpTestingController.expectOne(
      (req) => req.url === '/api/v1.0/global-weather-data/pollutant-averages',
    );
    expect(pollutants.request.params.get('country')).toBe('Iceland');
    pollutants.flush({ pollutants: [] });

    service.getMoonPhaseDistribution('Iceland').subscribe((response) => {
      expect(response.phase_distribution).toEqual([]);
    });
    const moonPhases = httpTestingController.expectOne(
      (req) => req.url === '/api/v1.0/global-weather-data/moon-phase-distribution',
    );
    expect(moonPhases.request.params.get('country')).toBe('Iceland');
    moonPhases.flush({
      phase_distribution: [],
      avg_moon_illumination: 0,
      astronomical_event_occurs: { true: 0, false: 0, null: 0 },
    });
  });

  it('uses the API message shape for profile and admin mutations', () => {
    service.updateUser('user-1', { username: 'new-name' }).subscribe((response) => {
      expect(response.message).toBe('User details updated successfully');
    });
    const profileUpdate = httpTestingController.expectOne('/api/v1.0/users/user-1');
    expect(profileUpdate.request.method).toBe('PATCH');
    profileUpdate.flush({ message: 'User details updated successfully' });

    service.updateUserRole('user-1', { role: 'admin' }).subscribe((response) => {
      expect(response.message).toBe('User role updated successfully');
    });
    const roleUpdate = httpTestingController.expectOne('/api/v1.0/admin/users/user-1');
    expect(roleUpdate.request.method).toBe('PATCH');
    roleUpdate.flush({ message: 'User role updated successfully' });
  });

  it('uses message responses for updates to nested resources', () => {
    service.updateFavourite('user-1', 'favourite-1', { preferred: true }).subscribe((response) => {
      expect(response.message).toBe('Favourite details updated successfully');
    });
    httpTestingController.expectOne('/api/v1.0/users/user-1/favourites/favourite-1')
      .flush({ message: 'Favourite details updated successfully' });

    service.updateComparisonArea('user-1', 'area-1', { label: 'New label' }).subscribe((response) => {
      expect(response.message).toBe('Comparison area details updated successfully');
    });
    httpTestingController.expectOne('/api/v1.0/users/user-1/comparison-areas/area-1')
      .flush({ message: 'Comparison area details updated successfully' });

    service.updateWeatherReview('weather-1', 'review-1', { rating: 4 }).subscribe((response) => {
      expect(response.message).toBe('Review updated successfully');
    });
    httpTestingController.expectOne('/api/v1.0/global-weather-data/weather-1/weather-reviews/review-1')
      .flush({ message: 'Review updated successfully' });

    service.updateAirQualityReading('weather-1', 'reading-1', { value: 10 }).subscribe((response) => {
      expect(response.message).toBe('Air-quality reading updated successfully');
    });
    httpTestingController.expectOne('/api/v1.0/global-weather-data/weather-1/air-quality-readings/reading-1')
      .flush({ message: 'Air-quality reading updated successfully' });

    service.updateAstronomicalEvent('weather-1', 'event-1', { event: 'sunset' })
      .subscribe((response) => {
        expect(response.message).toBe('Astronomical event updated successfully');
      });
    httpTestingController.expectOne('/api/v1.0/global-weather-data/weather-1/astronomical-events/event-1')
      .flush({ message: 'Astronomical event updated successfully' });
  });
});
