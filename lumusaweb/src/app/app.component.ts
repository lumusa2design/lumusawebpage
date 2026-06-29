import { Component } from '@angular/core';
import { Navbar } from './core/navbar/navbar';
import { Hero } from './components/hero/hero';
import { Projects } from './features/home/projects/projects';
import {About} from './components/about/about';
import { Technologies } from './components/technologies/technologies';
import { AlgorithmLab } from './components/algorithm-lab/algorithm-lab';
import { Credentials } from './components/credentials/credentials';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    Navbar,
    Hero, 
    Projects,
    About,
    Technologies,
    AlgorithmLab,
    Credentials,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}