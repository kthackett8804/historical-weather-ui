import { Routes } from '@angular/router';
//CONNECT THESE & CUT DOWN ON IMPORTS


// Main pages
import { Home } from './components/home/home';
import { Weather } from './components/weather/weather';
import { WeatherSearch } from './components/weather-search/weather-search';
import { NearbyWeather } from './components/nearby-weather/nearby-weather';
import { WeatherDetails } from './components/weather-details/weather-details';

// Weather details
import { AirQuality } from './components/air-quality/air-quality';
import { AstronomicalEvents } from './components/astronomical-events/astronomical-events';

// Analytics
import { Analytics } from './components/analytics/analytics';

// Reviews
import { Reviews } from './components/reviews/reviews';

// Authentication
import { Login } from './components/login/login';
import { Register } from './components/register/register';

// User functionality
import { Profile } from './components/profile/profile';
import { Favourites } from './components/favourites/favourites';
import { Comparison } from './components/comparison/comparison';

// Administration
import { AdminUsers } from './components/admin-users/admin-users';

// Error page
import { NotFound } from './components/not-found/not-found';


export const routes: Routes = [

  // Home page
  {
    path: '',
    component: Home
  },

  // Weather data
  {
    path: 'weather',
    component: Weather
  },

  // Search weather
  {
    path: 'weather/search',
    component: WeatherSearch
  },

  // Nearby weather locations
  {
    path: 'weather/nearby',
    component: NearbyWeather
  },

  // Individual weather details
  {
    path: 'weather/:id',
    component: WeatherDetails
  },

  // Air quality readings
  {
    path: 'weather/:id/air-quality',
    component: AirQuality
  },

  // Astronomical events
  {
    path: 'weather/:id/astronomical-events',
    component: AstronomicalEvents
  },

  // Analytics dashboard
  {
    path: 'analytics',
    component: Analytics
  },

  // Weather reviews
  {
    path: 'reviews',
    component: Reviews
  },

  // User authentication
  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  // User profile
  {
    path: 'profile/:userId',
    component: Profile
  },

  // Favourites
  {
    path: 'favourites',
    component: Favourites
  },

  // Comparison areas
  {
    path: 'comparison',
    component: Comparison
  },

  // Admin user management
  {
    path: 'admin/users',
    component: AdminUsers
  },

  // Unknown routes
  {
    path: '**',
    component: NotFound
  }

];
