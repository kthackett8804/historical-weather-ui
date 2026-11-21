//sample DATA REMOVE WHEN HOOK BACKEND UP

export interface WeatherRecord {
  id: string;
  location: string;
  country: string;
  date: string;
  temperatureC: number;
  condition: string;
  precipitationMm: number;
}

export interface WeatherReview {
  id: string;
  weatherId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export const SAMPLE_WEATHER: WeatherRecord[] = [
  {
    id: 'weather-1',
    location: 'Vancouver',
    country: 'Canada',
    date: '2025-06-18',
    temperatureC: 19,
    condition: 'Partly cloudy',
    precipitationMm: 0.4,
  },
  {
    id: 'weather-2',
    location: 'Reykjavik',
    country: 'Iceland',
    date: '2025-02-11',
    temperatureC: 3,
    condition: 'Light snow',
    precipitationMm: 2.1,
  },
  {
    id: 'weather-3',
    location: 'Lisbon',
    country: 'Portugal',
    date: '2024-09-07',
    temperatureC: 26,
    condition: 'Sunny',
    precipitationMm: 0,
  },
];

export const SAMPLE_REVIEWS: WeatherReview[] = [
  {
    id: 'review-1',
    weatherId: 'weather-1',
    author: 'Maya Chen',
    rating: 5,
    comment: 'A mild afternoon with a brief shower near the waterfront.',
    date: '2025-06-20',
  },
  {
    id: 'review-2',
    weatherId: 'weather-2',
    author: 'Jonas Einarsson',
    rating: 4,
    comment: 'The snowfall was light but the wind made it feel colder.',
    date: '2025-02-12',
  },
];
