import { Component } from '@angular/core';
import {PresentationComponent} from './presentation/presentation.component';
@Component(
  {selector: 'app-home',
    imports: [
      PresentationComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'})

export class HomeComponent
{

}
