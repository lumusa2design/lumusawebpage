import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {AboutmeComponent} from './pages/aboutme/aboutme.component';
import {LearnComponent} from './pages/learn/learn.component';
import {ContactComponent} from './pages/contact/contact.component';

export const routes: Routes = [
  {
    path:'', component: HomeComponent,
  },
  {
    path:'aboutme', component:AboutmeComponent,
  },
  {
    path:'learn', component:LearnComponent,
  }, {
    path:'contact', component:ContactComponent,
  }

];
