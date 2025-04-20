import { Routes } from '@angular/router';
import {CounterComponent} from './pages/counter/counter.component';
import {HeroComponent} from './pages/hero/hero.component';
import {DragonballPageComponent} from './pages/dragonball/dragonball-page.component';

export const routes: Routes = [
  {
    path: '',
    component: CounterComponent,
  },
  {
    path: 'hero',
    component: HeroComponent,
  },
  {
    path: 'Dragonball',
    component:DragonballPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
