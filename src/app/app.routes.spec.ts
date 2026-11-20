import { AppShell } from './components/app-boilerplate/app-boilerplate';
import { Analytics } from './components/analytics/analytics';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { NotFound } from './components/not-found/not-found';
import { Register } from './components/register/register';
import { routes } from './app.routes';
import { AirQuality } from './components/air-quality/air-quality';
import { AstronomicalEvents } from './components/astronomical-events/astronomical-events';
import { NearbyWeather } from './components/nearby-weather/nearby-weather';
import { WeatherDetails } from './components/weather-details/weather-details';
import { WeatherSearch } from './components/weather-search/weather-search';
import { Weather } from './components/weather/weather';
import { Comparison } from './components/comparison/comparison';
import { Favourites } from './components/favourites/favourites';
import { Profile } from './components/profile/profile';
import { AdminUsers } from './components/admin-users/admin-users';
import { Account } from './components/account/account';
import { Reviews } from './components/reviews/reviews';

describe('routes', () => {
  const shellRoute = routes.find((route) => route.path === '');
  const childRoutes = shellRoute?.children ?? [];

  it('keeps authentication pages standalone and places storyboard pages in AppShell', () => {
    expect(routes.find((route) => route.path === 'login')?.component).toBe(Login);
    expect(routes.find((route) => route.path === 'register')?.component).toBe(Register);
    expect(shellRoute?.component).toBe(AppShell);
    expect(childRoutes.find((route) => route.path === '')?.component).toBe(Home);
    expect(childRoutes.find((route) => route.path === 'dashboard')?.component).toBe(Home);
    expect(childRoutes.find((route) => route.path === 'analytics')?.component).toBe(Analytics);
    expect(childRoutes.find((route) => route.path === 'profile/:userId')?.component).toBe(Profile);
    expect(childRoutes.find((route) => route.path === 'account')?.component).toBe(Account);
    expect(childRoutes.find((route) => route.path === 'favourites')?.component).toBe(Favourites);
    expect(childRoutes.find((route) => route.path === 'comparison')?.component).toBe(Comparison);
    expect(childRoutes.find((route) => route.path === 'admin/users')?.component).toBe(AdminUsers);
    expect(childRoutes.find((route) => route.path === 'reviews')?.component).toBe(Reviews);
  });

  it('preserves the implemented weather routes with static paths before the ID route', () => {
    const paths = childRoutes.map((route) => route.path);
    const weatherIdIndex = paths.indexOf('weather/:id');

    expect(childRoutes.find((route) => route.path === 'weather')?.component).toBe(Weather);
    expect(childRoutes.find((route) => route.path === 'weather/search')?.component).toBe(
      WeatherSearch,
    );
    expect(childRoutes.find((route) => route.path === 'weather/nearby')?.component).toBe(
      NearbyWeather,
    );
    expect(childRoutes.find((route) => route.path === 'weather/:id')?.component).toBe(
      WeatherDetails,
    );
    expect(childRoutes.find((route) => route.path === 'weather/:id/air-quality')?.component).toBe(
      AirQuality,
    );
    expect(
      childRoutes.find((route) => route.path === 'weather/:id/astronomical-events')?.component,
    ).toBe(AstronomicalEvents);
    expect(paths.indexOf('weather/search')).toBeLessThan(weatherIdIndex);
    expect(paths.indexOf('weather/nearby')).toBeLessThan(weatherIdIndex);
  });

  it('keeps the not-found route last inside AppShell', () => {
    const notFoundRoute = childRoutes[childRoutes.length - 1];

    expect(notFoundRoute?.path).toBe('**');
    expect(notFoundRoute?.component).toBe(NotFound);
  });
});
