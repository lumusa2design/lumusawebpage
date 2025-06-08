import {Component, Input} from '@angular/core';
import {ProjectsInterface} from '../../../../../interfaces/projects.interface';

@Component({
  selector: 'app-workTargets',
  imports: [],
  templateUrl: './work.targets.component.html',
  styleUrl: './work.targets.component.css'
})
export class WorkTargetsComponent {
  @Input() project!: ProjectsInterface;
}
