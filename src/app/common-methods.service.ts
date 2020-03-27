import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  public isLoading = false;
  public isLoader = false;

  constructor() { }
  getSnackbarMessage(msg="",timer=2000) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerText=msg;
    setTimeout(function () { x.className = x.className.replace("show", ""); }, timer);
  }
  isUndefineORNull(data) {
    if (data === undefined || data == null || data.length <= 0) {
      return true;
    } else {
      return false;
    }
  }
}
