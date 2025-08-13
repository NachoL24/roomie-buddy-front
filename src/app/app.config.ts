import { ApplicationConfig, InjectionToken, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';

import { routes } from './app.routes';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';
import { getEnvironment } from '../environments/runtime-env';
const environment = getEnvironment();
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { REPOSITORY_PROVIDERS } from './infrastructure/providers/repository.providers';

// Formato personalizado para fechas en DD/MM/YYYY
export const DD_MM_YYYY_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Adapter personalizado para manejar el formato DD/MM/YYYY
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (!value || typeof value !== 'string') {
      return null;
    }

    // Esperamos formato DD/MM/YYYY
    const parts = value.split('/');
    if (parts.length !== 3) {
      return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }

    // Crear fecha (month es 0-indexed en JavaScript)
    const date = new Date(year, month - 1, day);

    // Verificar que la fecha sea válida
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return null;
    }

    return date;
  }

  override format(date: Date, displayFormat: Object): string {
    if (!date) {
      return '';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  }
}

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');
export const auth0Config = new InjectionToken<Auth0Config>('auth0Config');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: `${window.location.origin}/auth/callback`,
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
    { provide: auth0Config, useValue: environment.auth0 },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    ...REPOSITORY_PROVIDERS
  ]
};

export interface Auth0Config {
  domain: string;
  clientId: string;
  audience: string;
}
