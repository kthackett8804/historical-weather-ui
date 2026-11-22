import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAuth0({
      domain: 'dev-soxcasvvmapz284l.us.auth0.com',
      clientId: '0Wxj0lsRYfI7Bv3oQE9x12hTO7ro3SJa',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ]
};
