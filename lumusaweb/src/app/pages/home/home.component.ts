import { Component } from '@angular/core';
import {PresentationComponent} from './presentation/presentation.component';
import {WorksComponent} from './works/works.component';
@Component(
  {selector: 'app-home',
    imports: [
      PresentationComponent,
      WorksComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'})

export class HomeComponent
{

}
