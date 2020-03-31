import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public router:Router) { }
  canActivate(): boolean {
    // if (!localStorage.getItem('authcode') ||  !localStorage.getItem('PolicyLists') ) {
    //   this.router.navigate(['policyDataSync']);
    //   return false;
    // }
     return true;
  }
}
