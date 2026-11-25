// Shared API models for the Global Weather API.

// Common Models

/** Standard API error body. */
export interface ApiError {
  message: string;
}

/** Message-only API response. */
export interface MessageResponse extends ApiError {}

/** Shared pagination metadata returned by paginated endpoints. */
export interface Pagination {
  page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
}

/** Supported sort directions. */
export type SortOrder = 'asc' | 'desc';

/** Geographic location in GeoJSON Point format; coordinates are [longitude, latitude]. */
export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number];
}

// Authentication Models

/** Request body for registering a user. */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** Response returned after successful registration. */
export interface RegisterResponse {
  message: string;
  user_id: string;
  role: UserRole;
}

/** Request body for logging in. */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Request body for exchanging a verified Auth0 ID token for an API JWT. */
export interface Auth0LoginRequest {
  id_token: string;
}

/** Response returned after successful login. */
export interface LoginResponse {
  token: string;
  username: string;
  user_id: string;
  role: UserRole;
  email?: string;
}

/** Roles supported by the API. */
export type UserRole = 'user' | 'admin';

// User Models

/** A saved user location, either a favourite or comparison area. */
export interface SavedLocation {
  _id: string;
  country: string;
  location_name: string;
}

/** A user's favourite location. */
export interface FavouriteLocation extends SavedLocation {
  preferred: boolean;
}

/** A user's saved comparison area. */
export interface ComparisonArea extends SavedLocation {
  label: string;
}

/** User representation returned by user endpoints. */
export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  favourites?: FavouriteLocation[];
  comparison_areas?: ComparisonArea[];
}

/** Response returned when retrieving one user. */
export interface UserResponse {
  user: User;
}

/** Response returned when retrieving all users as an administrator. */
export interface UsersResponse {
  users: User[];
}

/** Request body for updating a user's profile. */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
}

/** Request body for changing a user's role. */
export interface UpdateUserRoleRequest {
  role: UserRole;
}

/** Request body for adding a favourite location. */
export interface CreateFavouriteRequest {
  country: string;
  location_name: string;
  preferred: boolean;
}

/** Request body for partially updating a favourite location. */
export interface UpdateFavouriteRequest {
  country?: string;
  location_name?: string;
  preferred?: boolean;
}

/** Response containing one favourite location. */
export interface FavouriteResponse {
  location: FavouriteLocation;
}

/** Response containing a user's favourite locations. */
export interface FavouritesResponse {
  favourites: FavouriteLocation[];
}

/** Request body for adding a comparison area. */
export interface CreateComparisonAreaRequest {
  country: string;
  location_name: string;
  label: string;
}

/** Request body for partially updating a comparison area. */
export interface UpdateComparisonAreaRequest {
  country?: string;
  location_name?: string;
  label?: string;
}

/** Response containing a saved comparison area. */
export interface ComparisonAreaResponse {
  location: ComparisonArea;
}

/** Response containing a user's comparison areas. */
export interface ComparisonAreasResponse {
  comparison_areas: ComparisonArea[];
}

// Weather Models

/** Reading associated with a weather record. */
export interface AirQualityReading {
  _id: string;
  type: 'pollutant' | 'index';
  name: string;
  value: number;
}

/** Astronomical event associated with a weather record. */
export interface AstronomicalEvent {
  _id: string;
  event: string;
  time: string | null;
  occurs: boolean | null;
}

/** Review associated with a weather record. */
export interface WeatherReview {
  _id: string;
  username: string;
  comment: string;
  rating: number;
  favourite_location: boolean;
  weather_id?: string;
  country?: string;
  location_name?: string;
}

/** Full weather record returned by list and detail endpoints. */
export interface WeatherRecord {
  _id: string;
  country: string;
  location_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  /** The API examples return an ISO 8601 timestamp for this field. */
  last_updated_epoch: string;
  last_updated: string;
  temperature_celsius: number;
  temperature_fahrenheit: number;
  condition_text: string;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_direction: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feels_like_celsius: number;
  feels_like_fahrenheit: number;
  visibility_km: number;
  visibility_miles: number;
  uv_index: number;
  gust_mph: number;
  gust_kph: number;
  moon_phase: string;
  moon_illumination: number;
  location: GeoJsonPoint;
  distance_km?: number;
  air_quality_readings?: AirQualityReading[];
  astronomical_events?: AstronomicalEvent[];
  weather_reviews?: WeatherReview[];
}

/** Query parameters for listing weather records. */
export interface GetWeatherRecordsParams {
  page?: number;
  per_page?: number;
  country?: string;
  location_name?: string;
  date_from?: string;
  date_to?: string;
  min_temp_celsius?: number;
  max_temp_celsius?: number;
  min_temp_fahrenheit?: number;
  max_temp_fahrenheit?: number;
  sort_by?: string;
  order?: SortOrder;
}

/** Paginated weather records response. */
export interface WeatherRecordsResponse extends Pagination {
  data: WeatherRecord[];
}

/** Query parameters for searching weather records. */
export interface SearchWeatherParams {
  page?: number;
  per_page?: number;
  countries?: string;
  condition_text?: string;
  sort_by?: WeatherSortField;
  order?: SortOrder;
}

/** Fields accepted by the weather search sort_by query parameter. */
export type WeatherSortField =
  | 'date'
  | 'last_updated'
  | 'country'
  | 'location_name'
  | 'temperature_celsius'
  | 'temperature_fahrenheit';

/** Query parameters for finding weather records near a coordinate. */
export interface NearbyWeatherParams {
  latitude: number;
  longitude: number;
  max_distance_km: number;
}

/** Response returned by the nearby weather endpoint. */
export interface NearbyWeatherResponse {
  weather_records: Array<WeatherRecord & { distance_km: number }>;
}

/** Response returned when retrieving one weather record. */
export interface WeatherResponse {
  weather: WeatherRecord;
}

/** Response containing all air-quality readings for a weather record. */
export interface AirQualityReadingsResponse {
  air_quality_readings: AirQualityReading[];
}

/** Response containing one air-quality reading. */
export interface AirQualityReadingResponse {
  air_quality_reading: AirQualityReading;
}

/** Request body for creating an air-quality reading. */
export interface CreateAirQualityReadingRequest {
  type: 'pollutant' | 'index';
  name: string;
  value: number;
}

/** Request body for partially updating an air-quality reading. */
export interface UpdateAirQualityReadingRequest {
  type?: 'pollutant' | 'index';
  name?: string;
  value?: number;
}

/** Response containing all astronomical events for a weather record. */
export interface AstronomicalEventsResponse {
  astronomical_events: AstronomicalEvent[];
}

/** Response containing one astronomical event. */
export interface AstronomicalEventResponse {
  astronomical_event: AstronomicalEvent;
}

/** Request body for creating an astronomical event. */
export interface CreateAstronomicalEventRequest {
  event: string;
  time?: string | null;
}

/** Request body for partially updating an astronomical event. */
export interface UpdateAstronomicalEventRequest {
  event?: string;
  time?: string | null;
}

// Review Models

/** Query parameters for filtering weather reviews. */
export interface GetWeatherReviewsParams {
  min_rating?: number;
  max_rating?: number;
  username?: string;
  favourite_location?: boolean;
}

/** Response containing weather reviews. */
export interface WeatherReviewsResponse {
  weather_reviews: WeatherReview[];
}

/** Request body for adding a review to a weather record. */
export interface CreateWeatherReviewRequest {
  comment: string;
  rating: number;
  favourite_location?: boolean;
}

/** Request body for partially updating a review. */
export interface UpdateWeatherReviewRequest {
  comment?: string;
  rating?: number;
  favourite_location?: boolean;
}

/** Response containing a newly created weather review. */
export interface WeatherReviewResponse {
  weather_review: WeatherReview;
}

// Analytics Models

/** Summary statistics for one country. */
export interface CountrySummary {
  country: string;
  avg_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_humidity: number;
  avg_wind_speed: number;
  distinct_locations: number;
}

/** Query parameters for country-specific analytics. */
export interface CountryQueryParams {
  country: string;
}

/** One country in the weather comparison response. */
export interface CountryComparison {
  country: string;
  avg_temperature: number;
  min_temperature: number;
  max_temperature: number;
  avg_humidity: number;
  avg_wind_speed: number;
  total_precipitation_mm: number;
  avg_uv_index: number;
  records: number;
}

/** Response comparing saved countries for the authenticated user. */
export interface CountryComparisonResponse {
  requested: string[];
  countries: CountryComparison[];
}

/** One month's weather summary. */
export interface MonthlyWeatherTrend {
  year: number;
  month: number;
  avg_temperature: number;
  total_precipitation_mm: number;
  avg_humidity: number;
}

/** Response containing a country's monthly weather trend. */
export interface MonthlyWeatherTrendResponse {
  monthly_trend: MonthlyWeatherTrend[];
}

/** Compact record used in extreme-weather rankings. */
export interface ExtremeWeatherRecord {
  country: string;
  location_name: string;
  last_updated: string;
  temperature_celsius: number;
  wind_kph: number;
  uv_index: number;
  condition_text: string;
}

/** Response containing top records by extreme weather category. */
export interface ExtremeWeatherResponse {
  hottest: ExtremeWeatherRecord[];
  coldest: ExtremeWeatherRecord[];
  windiest: ExtremeWeatherRecord[];
  highest_uv: ExtremeWeatherRecord[];
  limit: number;
}

/** Query parameters for extreme-weather rankings. */
export interface ExtremeWeatherParams {
  limit?: number;
}

/** Country's air-quality index ranking entry. */
export interface AirQualityRankingEntry {
  rank: number;
  country: string;
  avg_aqi: number;
  readings: number;
}

/** Response containing countries ranked by average air-quality index. */
export interface AirQualityRankingResponse {
  index: string;
  order: SortOrder;
  ranking: AirQualityRankingEntry[];
}

/** Air-quality ranking query parameters. */
export interface AirQualityRankingParams {
  index?: string;
  order?: SortOrder;
}

/** Average pollutant measurement for a country. */
export interface PollutantAverage {
  pollutant: string;
  avg_value: number;
  readings: number;
}

/** Response containing pollutant averages. */
export interface PollutantAveragesResponse {
  pollutants: PollutantAverage[];
}

/** Location-level weather review statistics. */
export interface LocationReviewStats {
  location_name: string;
  country: string;
  avg_rating: number;
  total_reviews: number;
  favourite_percentage: number;
}

/** Response containing review statistics by location. */
export interface ReviewStatsResponse {
  min_reviews: number;
  count: number;
  locations: LocationReviewStats[];
}

/** Query parameters for weather review statistics. */
export interface ReviewStatsParams {
  min_reviews?: number;
}

/** Distribution count for a moon phase. */
export interface MoonPhaseCount {
  moon_phase: string;
  count: number;
  avg_illumination: number;
}

/** Counts of astronomical events grouped by whether they occur. */
export interface AstronomicalEventOccurrenceCounts {
  true: number;
  false: number;
  null: number;
}

/** Response containing moon phase distribution data. */
export interface MoonPhaseDistributionResponse {
  phase_distribution: MoonPhaseCount[];
  avg_moon_illumination: number;
  astronomical_event_occurs: AstronomicalEventOccurrenceCounts;
}

/** One period's daylight statistics. */
export interface DaylightHoursEntry {
  year: number;
  month?: number;
  country?: string;
  avg_daylight_hours: number;
  min_daylight_hours: number;
  max_daylight_hours: number;
  records: number;
  wrapped_records: number;
}

/** Response containing daylight-hour statistics. */
export interface DaylightHoursResponse {
  group_by: 'country' | 'month';
  exclude_anomalies: boolean;
  daylight_hours: DaylightHoursEntry[];
}

/** Query parameters for daylight-hour statistics. */
export interface DaylightHoursParams {
  group_by?: 'country' | 'month';
}

/** Response containing paginated daylight-anomaly weather records. */
export interface DaylightAnomaliesResponse extends Pagination {
  data: WeatherRecord[];
}

/** Query parameters for paginated daylight anomalies. */
export interface DaylightAnomaliesParams {
  page?: number;
  per_page?: number;
}

/** Latest weather summary for a saved favourite. */
export interface FavouriteWeatherRecord {
  country: string;
  location_name: string;
  last_updated: string;
  temperature_celsius: number;
  condition_text: string;
  humidity: number;
  wind_kph: number;
  precip_mm: number;
  uv_index: number;
}

/** Response containing latest weather for the user's favourites. */
export interface FavouritesWeatherResponse {
  count: number;
  weather_records: FavouriteWeatherRecord[];
}