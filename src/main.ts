import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { LoaderService } from './app/core/Services/loader.service';
import { loadingInterceptor } from './app/core/Interceptor/LoadingInterceptor';
import { tokenInterceptor } from './app/core/Interceptor/TokenInterceptor';
import { refreshInterceptor } from './app/core/Interceptor/RefreshInterceptor';
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    LoaderService,
    provideHttpClient(withInterceptors([
      loadingInterceptor,
      tokenInterceptor,
      refreshInterceptor]))
  ]
}).catch(err => console.error(err));

