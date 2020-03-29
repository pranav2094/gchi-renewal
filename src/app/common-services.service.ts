import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

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
    this.jsonhttpOptions  = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': localStorage.getItem("basicAuth"),
      })
    };
  } 
  getWithParams(endPoint: any): Observable<any>  {
    console.log(endPoint);
    
    return this.http.get(this.baseURL + endPoint);
  }
}
