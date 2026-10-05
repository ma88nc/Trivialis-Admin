import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MainSubject } from '../models/mainsubject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainSubjectService {
  private http = inject(HttpClient);

  // temp
  private baseUrl = 'https://localhost:7073/api/';
  private fullUrl = this.baseUrl + 'MainSubjects';

//   GetAll() : Observable<MainSubject> {
//     return this.http.get<MainSubject>(this.baseUrl+'MainSubject');
// /*     .subscribe(
//       res => { 
//     console.log('Body:', res);
//       } */    
//   }

  selectedMainSubject = signal<MainSubject | undefined>(undefined);

  mainSubjectsResource = httpResource<MainSubject[]>(() => this.fullUrl, { defaultValue: []});
}
