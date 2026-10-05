import { inject, Injectable, signal } from '@angular/core';
import { Question } from '../models/question';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'https://localhost:7073/api/';
  private fullUrl = this.baseUrl + 'Questions';

  _http = inject(HttpClient);

  questionsResource = httpResource<Question[]>(() => this.fullUrl, { defaultValue: []}); 

  postQuestion(question: Question) {
    return this._http.post<Question>(this.fullUrl, question)
    .pipe(
     // tap(console.log('Response of POST question: '+JSON.stringify(data)),
      catchError(this.handleError))
   // .subscribe(data => console.log('Response of POST question: '+JSON.stringify(data)))
    ;
  }

  putQuestion(question: Question, questionId: string) {
    return this._http.put<Question>(`${this.fullUrl}/${questionId}`, question)
    .pipe(
      catchError(this.handleError))
    ;
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return throwError(() => new Error(err.message));
  }
}
