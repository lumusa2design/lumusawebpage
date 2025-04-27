import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  //Hash Strategy
    {provide:LocationStrategy,
  useClass: HashLocationStrategy,},
  ]


};
