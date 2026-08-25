import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { API_BASE_URL } from './interceptors/base-url.token';
import { ConfirmationService, MessageService } from '@openng/optimus-ui/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideOptimus({ theme: { preset: Aura } }),
    MessageService,
    ConfirmationService,
    MessageService,
    provideHttpClient(
      withInterceptors([baseUrlInterceptor])
    ),
    {
      provide:API_BASE_URL,
      useValue: 'http://localhost:8080',
    }
  ],
};
