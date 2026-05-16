import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, DatePipe, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { routes } from './app.routes';
import { authInterceptor } from './security/service/basic-auth-htpp-interceptor.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

registerLocaleData(ptBr);

function initFaIcons(library: FaIconLibrary) {
  return () => library.addIconPacks(fas, far, fab);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: APP_BASE_HREF, useValue: '/app/voluntary' },
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initFaIcons,
      deps: [FaIconLibrary],
      multi: true,
    },
  ],
};
