import { AppShell } from './pages/app-boilerplate/app-boilerplate';
import { Analytics } from './pages/analytics/analytics';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { routes } from './app.routes';
import { AirQuality } from './pages/air-quality/air-quality';
import { AstronomicalEvents } from './pages/astronomical-events/astronomical-events';
import { NearbyWeather } from './pages/nearby-weather/nearby-weather';
import { WeatherDetails } from './pages/weather-details/weather-details';
import { WeatherSearch } from './pages/weather-search/weather-search';
import { Weather } from './pages/weather/weather';
import { Comparison } from './pages/comparison/comparison';
import { Favourites } from './pages/favourites/favourites';
import { Profile } from './pages/profile/profile';
import { AdminUsers } from './pages/admin-users/admin-users';
import { Account } from './pages/account/account';
import { Reviews } from './pages/reviews/reviews';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

describe('routes', () => {
  const shellRoute = routes.find((route) => route.path === '');
  const childRoutes = shellRoute?.children ?? [];

  it('keeps login standalone and places account pages in AppShell', () => {
    expect(routes.find((route) => route.path === 'login')?.component).toBe(Login);
    expect(routes.find((route) => route.path === 'register')).toBeUndefined();
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

  it('protects account routes and restricts the admin route', () => {
    expect(childRoutes.find((route) => route.path === 'profile/:userId')?.canActivate).toContain(
      authGuard,
    );
    expect(childRoutes.find((route) => route.path === 'favourites')?.canActivate).toContain(
      authGuard,
    );
    expect(childRoutes.find((route) => route.path === 'comparison')?.canActivate).toContain(
      authGuard,
    );
    expect(childRoutes.find((route) => route.path === 'admin/users')?.canActivate).toContain(
      adminGuard,
    );
  });

  it('keeps the not-found route last inside AppShell', () => {
    const notFoundRoute = childRoutes[childRoutes.length - 1];

    expect(notFoundRoute?.path).toBe('**');
    expect(notFoundRoute?.component).toBe(NotFound);
  });
});
