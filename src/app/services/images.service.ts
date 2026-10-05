import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor(private _http: HttpClient) { }

  addImage(fullFileName: string, base64File: any): Observable<any>
  {
    const data = {'image': base64File, 'fullFileName' : fullFileName};
    const apiUrl = `${environment.apiGatewayUrl}/upload-image`;
    console.log(`${environment.apiGatewayUrl}/upload-image`);

    return this._http.post(apiUrl, data)
      // .do(data => console.log('Response of POST question: '+JSON.stringify(data)))
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err))
      );

  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.error(err.message);
    return throwError(() => err.message);
  }
}
