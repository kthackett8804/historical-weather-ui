import { Routes } from '@angular/router';
import { AdminUsers } from './pages/admin-users/admin-users';
import { Account } from './pages/account/account';
import { AirQuality } from './pages/air-quality/air-quality';
import { Analytics } from './pages/analytics/analytics';
import { AppShell } from './pages/app-boilerplate/app-boilerplate';
import { AstronomicalEvents } from './pages/astronomical-events/astronomical-events';
import { Comparison } from './pages/comparison/comparison';
import { Favourites } from './pages/favourites/favourites';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { NearbyWeather } from './pages/nearby-weather/nearby-weather';
import { NotFound } from './pages/not-found/not-found';
import { Profile } from './pages/profile/profile';
import { Reviews } from './pages/reviews/reviews';
import { WeatherDetails } from './pages/weather-details/weather-details';
import { WeatherSearch } from './pages/weather-search/weather-search';
import { Weather } from './pages/weather/weather';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', component: Home },
      { path: 'dashboard', component: Home },
      { path: 'weather', component: Weather },
      { path: 'weather/search', component: WeatherSearch },
      { path: 'weather/nearby', component: NearbyWeather },
      { path: 'weather/:id/air-quality', component: AirQuality },
      { path: 'weather/:id/astronomical-events', component: AstronomicalEvents },
      { path: 'weather/:id', component: WeatherDetails },
      { path: 'analytics', component: Analytics },
      { path: 'reviews', component: Reviews },
      { path: 'account', component: Account },
      { path: 'profile/:userId', component: Profile },
      { path: 'favourites', component: Favourites },
      { path: 'comparison', component: Comparison },
      { path: 'admin/users', component: AdminUsers },
      { path: '**', component: NotFound },
    ],
  },
];
