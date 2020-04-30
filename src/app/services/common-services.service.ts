import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError, tap, map, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonServicesService {
  baseURL: any;
  prodBaseURL: any;
  authToken: any;
  jsonhttpOptions : any;

  constructor(public http: HttpClient, public router: Router) {
    this.baseURL = environment.baseURL;
    this.prodBaseURL = environment.ProdBaseURL;
    this.authToken = localStorage.getItem("basicAuth");
  } 
  getWithParams(endPoint: any): Observable<any>  {
    return this.http.get(this.baseURL + endPoint);
  }


  postWithParams(endPoint: any, body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Content-Type",
      'application/json'
    );
    return this.http.post(this.baseURL + endPoint, body, { headers: headers });
  }
  getUserData(endPoint: any){
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", this.authToken);
    headers = headers.append(
      "Content-Type",
      "application/x-www-form-urlencoded"
    );
    return this.http
      .post(this.baseURL + endPoint, {}, { headers: headers })
      .toPromise();
  }
  postAPICallWithAuthToken(endPoint, request): Observable<any> {
    this.jsonhttpOptions = this.checkHttpStatus(localStorage.getItem("basicAuth"));
    return this.http.post(this.baseURL + endPoint,request ,this.jsonhttpOptions).pipe(
      retry(2),
      tap(),
      catchError(this.errorHandler)
    );
  }


  getAPICallWithoutAuth(endPoint: string): Observable<any> {
    return this.http.get(this.baseURL + endPoint);
  }

  pdfDownload(type: any, policID: any) {
    return (
      this.baseURL + "api/file/DownloadPDF?type=" + type + "&value=" + policID
    );
  }
  checkHttpStatus(auth:string) {
    return this.jsonhttpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': auth
      })
    };
  }
  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    document.getElementById('showSpinnerDiv').style.display  ='none'; 
    alert('Something went wrong');
    //() => this.commonFn.showSpinner(false);
    //() => this.commonFn.getSnackbarMessage(errorMessage);
    return throwError(errorMessage);
  }
  
}
