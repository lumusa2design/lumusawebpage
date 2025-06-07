import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProjectsInterface} from '../interfaces/projects.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorksJsonServiceService {
  private jsonPath =  "database/projects.json";
  constructor(private http: HttpClient) { }
  getProjects(): Observable<ProjectsInterface[]> {
    return this.http.get<ProjectsInterface[]>(this.jsonPath);
  }
}
