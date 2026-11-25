import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AirQualityRankingParams,
  AirQualityRankingResponse,
  AirQualityReadingResponse,
  AirQualityReadingsResponse,
  Auth0LoginRequest,
  AstronomicalEventResponse,
  AstronomicalEventsResponse,
  ComparisonAreaResponse,
  ComparisonAreasResponse,
  CountryComparisonResponse,
  CountrySummary,
  CreateAirQualityReadingRequest,
  CreateAstronomicalEventRequest,
  CreateComparisonAreaRequest,
  CreateFavouriteRequest,
  CreateWeatherReviewRequest,
  DaylightAnomaliesParams,
  DaylightAnomaliesResponse,
  DaylightHoursParams,
  DaylightHoursResponse,
  ExtremeWeatherParams,
  ExtremeWeatherResponse,
  FavouriteResponse,
  FavouritesResponse,
  FavouritesWeatherResponse,
  GetWeatherRecordsParams,
  GetWeatherReviewsParams,
  LoginRequest,
  LoginResponse,
  MessageResponse,
  MonthlyWeatherTrendResponse,
  MoonPhaseDistributionResponse,
  NearbyWeatherParams,
  NearbyWeatherResponse,
  PollutantAveragesResponse,
  RegisterRequest,
  RegisterResponse,
  ReviewStatsResponse,
  SearchWeatherParams,
  UpdateAirQualityReadingRequest,
  UpdateAstronomicalEventRequest,
  UpdateComparisonAreaRequest,
  UpdateFavouriteRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UpdateWeatherReviewRequest,
  UserResponse,
  UsersResponse,
  WeatherRecord,
  WeatherRecordsResponse,
  WeatherResponse,
  WeatherReviewResponse,
  WeatherReviewsResponse,
} from '../models';

const API_BASE_URL = '/api/v1.0';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${API_BASE_URL}/registration`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/login`, request);
  }

  loginWithAuth0(idToken: string): Observable<LoginResponse> {
    const request: Auth0LoginRequest = { id_token: idToken };
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth0-login`, request);
  }

  logout(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${API_BASE_URL}/logout`, {});
  }

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${API_BASE_URL}/admin/users`);
  }

  deleteUser(userId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${API_BASE_URL}/admin/users/${this.segment(userId)}`);
  }

  updateUserRole(userId: string, request: UpdateUserRoleRequest): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${API_BASE_URL}/admin/users/${this.segment(userId)}`,
      request,
    );
  }

  getUser(userId: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${API_BASE_URL}/users/${this.segment(userId)}`);
  }

  updateUser(userId: string, request: UpdateUserRequest): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${API_BASE_URL}/users/${this.segment(userId)}`,
      request,
    );
  }

  getFavourites(userId: string): Observable<FavouritesResponse> {
    return this.http.get<FavouritesResponse>(`${this.userPath(userId)}/favourites`);
  }

  getFavourite(userId: string, favouriteId: string): Observable<FavouriteResponse> {
    return this.http.get<FavouriteResponse>(
      `${this.userPath(userId)}/favourites/${this.segment(favouriteId)}`,
    );
  }

  createFavourite(userId: string, request: CreateFavouriteRequest): Observable<FavouriteResponse> {
    return this.http.post<FavouriteResponse>(`${this.userPath(userId)}/favourites`, request);
  }

  updateFavourite(
    userId: string,
    favouriteId: string,
    request: UpdateFavouriteRequest,
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${this.userPath(userId)}/favourites/${this.segment(favouriteId)}`,
      request,
    );
  }

  deleteFavourite(userId: string, favouriteId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(
      `${this.userPath(userId)}/favourites/${this.segment(favouriteId)}`,
    );
  }

  getComparisonAreas(userId: string): Observable<ComparisonAreasResponse> {
    return this.http.get<ComparisonAreasResponse>(`${this.userPath(userId)}/comparison-areas`);
  }

  getComparisonArea(userId: string, locationId: string): Observable<ComparisonAreaResponse> {
    return this.http.get<ComparisonAreaResponse>(
      `${this.userPath(userId)}/comparison-areas/${this.segment(locationId)}`,
    );
  }

  createComparisonArea(
    userId: string,
    request: CreateComparisonAreaRequest,
  ): Observable<ComparisonAreaResponse> {
    return this.http.post<ComparisonAreaResponse>(
      `${this.userPath(userId)}/comparison-areas`,
      request,
    );
  }

  updateComparisonArea(
    userId: string,
    locationId: string,
    request: UpdateComparisonAreaRequest,
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${this.userPath(userId)}/comparison-areas/${this.segment(locationId)}`,
      request,
    );
  }

  deleteComparisonArea(userId: string, locationId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(
      `${this.userPath(userId)}/comparison-areas/${this.segment(locationId)}`,
    );
  }

  getWeatherRecords(params: GetWeatherRecordsParams = {}): Observable<WeatherRecordsResponse> {
    return this.http.get<WeatherRecordsResponse>(`${API_BASE_URL}/global-weather-data`, {
      params: this.toHttpParams(params),
    });
  }

  searchWeatherRecords(params: SearchWeatherParams = {}): Observable<WeatherRecordsResponse> {
    return this.http.get<WeatherRecordsResponse>(`${API_BASE_URL}/global-weather-data/search`, {
      params: this.toHttpParams(params),
    });
  }

  getNearbyWeather(params: NearbyWeatherParams): Observable<NearbyWeatherResponse> {
    return this.http.get<NearbyWeatherResponse>(
      `${API_BASE_URL}/global-weather-data/nearby-locations`,
      { params: this.toHttpParams(params) },
    );
  }

  getWeatherRecord(weatherId: string): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(
      `${API_BASE_URL}/global-weather-data/${this.segment(weatherId)}`,
    );
  }

  getCountrySummary(country: string): Observable<CountrySummary[]> {
    return this.http.get<CountrySummary[]>(`${API_BASE_URL}/global-weather-data/country-summary`, {
      params: this.toHttpParams({ country }),
    });
  }

  compareCountries(): Observable<CountryComparisonResponse> {
    return this.http.get<CountryComparisonResponse>(`${API_BASE_URL}/global-weather-data/compare`);
  }

  getMonthlyTrend(country: string): Observable<MonthlyWeatherTrendResponse> {
    return this.http.get<MonthlyWeatherTrendResponse>(
      `${API_BASE_URL}/global-weather-data/monthly-trend`,
      { params: this.toHttpParams({ country }) },
    );
  }

  getExtremeWeather(params: ExtremeWeatherParams = {}): Observable<ExtremeWeatherResponse> {
    return this.http.get<ExtremeWeatherResponse>(
      `${API_BASE_URL}/global-weather-data/extreme-weather`,
      { params: this.toHttpParams(params) },
    );
  }

  getAirQualityRanking(
    params: AirQualityRankingParams = {},
  ): Observable<AirQualityRankingResponse> {
    return this.http.get<AirQualityRankingResponse>(
      `${API_BASE_URL}/global-weather-data/air-quality-ranking`,
      { params: this.toHttpParams(params) },
    );
  }

  getPollutantAverages(country: string): Observable<PollutantAveragesResponse> {
    return this.http.get<PollutantAveragesResponse>(
      `${API_BASE_URL}/global-weather-data/pollutant-averages`,
      { params: this.toHttpParams({ country }) },
    );
  }

  getReviewStats(minReviews?: number): Observable<ReviewStatsResponse> {
    return this.http.get<ReviewStatsResponse>(
      `${API_BASE_URL}/global-weather-data/review-stats`,
      { params: this.toHttpParams({ min_reviews: minReviews }) },
    );
  }

  getMoonPhaseDistribution(country: string): Observable<MoonPhaseDistributionResponse> {
    return this.http.get<MoonPhaseDistributionResponse>(
      `${API_BASE_URL}/global-weather-data/moon-phase-distribution`,
      { params: this.toHttpParams({ country }) },
    );
  }

  getDaylightHours(params: DaylightHoursParams = {}): Observable<DaylightHoursResponse> {
    return this.http.get<DaylightHoursResponse>(
      `${API_BASE_URL}/global-weather-data/daylight-hours`,
      { params: this.toHttpParams(params) },
    );
  }

  getDaylightAnomalies(
    params: DaylightAnomaliesParams = {},
  ): Observable<DaylightAnomaliesResponse> {
    return this.http.get<DaylightAnomaliesResponse>(
      `${API_BASE_URL}/global-weather-data/daylight-hours/anomalies`,
      { params: this.toHttpParams(params) },
    );
  }

  getFavouritesWeather(): Observable<FavouritesWeatherResponse> {
    return this.http.get<FavouritesWeatherResponse>(
      `${API_BASE_URL}/global-weather-data/favourites-weather`,
    );
  }

  getWeatherReviews(params: GetWeatherReviewsParams = {}): Observable<WeatherReviewsResponse> {
    return this.http.get<WeatherReviewsResponse>(
      `${API_BASE_URL}/global-weather-data/weather-reviews`,
      { params: this.toHttpParams(params) },
    );
  }

  getWeatherRecordReviews(weatherId: string): Observable<WeatherReviewsResponse> {
    return this.http.get<WeatherReviewsResponse>(
      `${API_BASE_URL}/global-weather-data/${this.segment(weatherId)}/weather-reviews`,
    );
  }

  createWeatherReview(
    weatherId: string,
    request: CreateWeatherReviewRequest,
  ): Observable<WeatherReviewResponse> {
    return this.http.post<WeatherReviewResponse>(
      `${API_BASE_URL}/global-weather-data/${this.segment(weatherId)}/weather-reviews`,
      request,
    );
  }

  updateWeatherReview(
    weatherId: string,
    reviewId: string,
    request: UpdateWeatherReviewRequest,
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${API_BASE_URL}/global-weather-data/${this.segment(weatherId)}/weather-reviews/${this.segment(reviewId)}`,
      request,
    );
  }

  deleteWeatherReview(weatherId: string, reviewId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(
      `${API_BASE_URL}/global-weather-data/${this.segment(weatherId)}/weather-reviews/${this.segment(reviewId)}`,
    );
  }

  getAirQualityReadings(weatherId: string): Observable<AirQualityReadingsResponse> {
    return this.http.get<AirQualityReadingsResponse>(
      `${this.weatherPath(weatherId)}/air-quality-readings`,
    );
  }

  getAirQualityReading(weatherId: string, readingId: string): Observable<AirQualityReadingResponse> {
    return this.http.get<AirQualityReadingResponse>(
      `${this.weatherPath(weatherId)}/air-quality-readings/${this.segment(readingId)}`,
    );
  }

  createAirQualityReading(
    weatherId: string,
    request: CreateAirQualityReadingRequest,
  ): Observable<AirQualityReadingResponse> {
    return this.http.post<AirQualityReadingResponse>(
      `${this.weatherPath(weatherId)}/air-quality-readings`,
      request,
    );
  }

  updateAirQualityReading(
    weatherId: string,
    readingId: string,
    request: UpdateAirQualityReadingRequest,
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${this.weatherPath(weatherId)}/air-quality-readings/${this.segment(readingId)}`,
      request,
    );
  }

  deleteAirQualityReading(weatherId: string, readingId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(
      `${this.weatherPath(weatherId)}/air-quality-readings/${this.segment(readingId)}`,
    );
  }

  getAstronomicalEvents(weatherId: string): Observable<AstronomicalEventsResponse> {
    return this.http.get<AstronomicalEventsResponse>(
      `${this.weatherPath(weatherId)}/astronomical-events`,
    );
  }

  getAstronomicalEvent(weatherId: string, eventId: string): Observable<AstronomicalEventResponse> {
    return this.http.get<AstronomicalEventResponse>(
      `${this.weatherPath(weatherId)}/astronomical-events/${this.segment(eventId)}`,
    );
  }

  createAstronomicalEvent(
    weatherId: string,
    request: CreateAstronomicalEventRequest,
  ): Observable<AstronomicalEventResponse> {
    return this.http.post<AstronomicalEventResponse>(
      `${this.weatherPath(weatherId)}/astronomical-events`,
      request,
    );
  }

  updateAstronomicalEvent(
    weatherId: string,
    eventId: string,
    request: UpdateAstronomicalEventRequest,
  ): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(
      `${this.weatherPath(weatherId)}/astronomical-events/${this.segment(eventId)}`,
      request,
    );
  }

  deleteAstronomicalEvent(weatherId: string, eventId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(
      `${this.weatherPath(weatherId)}/astronomical-events/${this.segment(eventId)}`,
    );
  }

  private userPath(userId: string): string {
    return `${API_BASE_URL}/users/${this.segment(userId)}`;
  }

  private weatherPath(weatherId: string): string {
    return `${API_BASE_URL}/global-weather-data/${this.segment(weatherId)}`;
  }

  private segment(value: string): string {
    return encodeURIComponent(value);
  }

  private toHttpParams(values: object): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    }
    return params;
  }
}
