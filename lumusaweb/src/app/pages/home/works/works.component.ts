import {Component, OnInit} from '@angular/core';
import {ProjectsInterface} from '../../../../interfaces/projects.interface';
import {WorksJsonServiceService} from '../../../../services/works.json.service.service';

@Component({
  selector: 'app-works',
  imports: [],
  templateUrl: './works.component.html',
  styleUrl: './works.component.css'
})
export class WorksComponent implements OnInit {
  projects: ProjectsInterface[] = [];

  constructor(private works: WorksJsonServiceService) {}

  ngOnInit() {
    this.works.getProjects().subscribe(projects => this.projects = projects);
  }
}
