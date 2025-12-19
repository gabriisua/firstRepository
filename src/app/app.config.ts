import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './core/Interceptor/TokenInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';



export const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
     importProvidersFrom(BrowserAnimationsModule), provideAnimationsAsync()
  ]
}
