import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  public isLoading = false;
  public isLoader = false;
  public selctedDiseaseList:any;
  constructor() { }
  showSpinner(show,text="Please Wait")
  {
    if(show)
    {
      document.getElementById('showSpinnerDiv').style.display  ='';
      document.getElementById('loader_msg').innerText =  text;
      return;
    }
    else
    {
      document.getElementById('showSpinnerDiv').style.display  ='none'; 
      return;
    }
    
   }
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
  
  save(file: string, fileName: string) {
    console.log(file);
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(file, fileName);
    } else {
      console.log("creation");
      const downloadLink = document.createElement("a");
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
      downloadLink.setAttribute("href", file);
      downloadLink.setAttribute("download", fileName);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      console.log("clicked");
    }
  }
}
