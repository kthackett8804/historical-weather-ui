import { Routes } from '@angular/router';
import { AdminUsers } from './components/admin-users/admin-users';
import { Account } from './components/account/account';
import { AirQuality } from './components/air-quality/air-quality';
import { Analytics } from './components/analytics/analytics';
import { AppShell } from './components/app-boilerplate/app-boilerplate';
import { AstronomicalEvents } from './components/astronomical-events/astronomical-events';
import { Comparison } from './components/comparison/comparison';
import { Favourites } from './components/favourites/favourites';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { NearbyWeather } from './components/nearby-weather/nearby-weather';
import { NotFound } from './components/not-found/not-found';
import { Profile } from './components/profile/profile';
import { Register } from './components/register/register';
import { Reviews } from './components/reviews/reviews';
import { WeatherDetails } from './components/weather-details/weather-details';
import { WeatherSearch } from './components/weather-search/weather-search';
import { Weather } from './components/weather/weather';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
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
