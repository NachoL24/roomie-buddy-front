import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';
import { environment } from '../environments/env';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const auth0Config = new InjectionToken<Auth0Config>('auth0Config');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.auth0.audience
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.API_BASE_URL}/*`,
            tokenOptions: {
              authorizationParams: {
                audience: environment.auth0.audience,
                scope: 'openid profile email create:expense'
              }
            }
          }
        ]
      }
    }),
    { provide: API_BASE_URL, useValue: environment.API_BASE_URL },
    { provide: auth0Config, useValue: environment.auth0 }
  ]
};

export interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
}
