import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

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
    return this.http.post(this.baseURL + endPoint,request ,this.jsonhttpOptions);
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
  
}
