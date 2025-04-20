import { Routes } from '@angular/router';
import {CounterComponent} from './pages/counter/counter.component';
import {HeroComponent} from './pages/hero/hero.component';

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
    path: '**',
    redirectTo: '',
  }
];
