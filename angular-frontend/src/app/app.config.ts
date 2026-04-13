import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { routes } from './app.routes';
import { authInterceptor } from './shared/auth.interceptor'; // Asegúrate de haber creado este archivo en shared

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // Esto es lo que añade la "llave" a tus peticiones
    ),
  ],
};