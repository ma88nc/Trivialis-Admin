import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MainSubjectService } from './mainsubject.service';
import { Title } from '../models/title';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
    // temp
  private baseUrl = 'https://localhost:7073/api/';
  private fullUrl = this.baseUrl + 'Titles';

  private mainSubjectService = inject(MainSubjectService);
  _http = inject(HttpClient);

  titlesResource = httpResource<Title[]>(() => {
    const ms = this.mainSubjectService.selectedMainSubject();
    console.log("In titles svc - selected main subj ", ms)
    if (ms) { 
   //   return `${this.fullUrl}?MainSubjectId=${ms.mainSubjectId}`;
      return this.fullUrl;
    } else {
      return undefined;
    }      
    },
      { defaultValue: [] }
  );

  addTitle(domainId: number, title: Title) {
    return this._http.post<Title>(this.fullUrl, title)
    .pipe(
      catchError(this.handleError));
  }

/*
  postQuestion(question: Question) {
    return this._http.post<Question>(this.fullUrl, question)
    .pipe(
     // tap(console.log('Response of POST question: '+JSON.stringify(data)),
      catchError(this.handleError))
   // .subscribe(data => console.log('Response of POST question: '+JSON.stringify(data)))
    ;
  }

*/

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return throwError(() => new Error(err.message));
  }
}
