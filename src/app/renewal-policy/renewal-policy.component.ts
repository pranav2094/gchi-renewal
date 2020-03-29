import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonMethodsService } from 'src/app/common-methods.service';
import {CommonServicesService} from 'src/app/common-services.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DiseaseModalComponent } from '../disease-modal/disease-modal.component';

declare var $: any;

@Component({
  selector: 'app-renewal-policy',
  templateUrl: './renewal-policy.component.html',
  styleUrls: ['./renewal-policy.component.scss']
})
export class RenewalPolicyComponent implements OnInit {
  memmaxDOBHB: any; meminDOBHB: any; 
  snackbarMessage:any;
  dateofBirth:any;
  showRenewal:boolean=false;
  insureDetails:{};
  questionList:any;
 
  constructor(public matDialog: MatDialog, public cm:CommonMethodsService,public cs:CommonServicesService) { }

  ngOnInit(): void {
    var today = new Date();
    
    this.memmaxDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 21));
    this.meminDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 75));
    this.memmaxDOBHB = moment(this.memmaxDOBHB).format('YYYY-MM-DD');
    this.meminDOBHB = moment(this.meminDOBHB).format('YYYY-MM-DD');
    this.getDiseaseList();
  }
  getDateOfBirth(ev:any)
  {
    console.log(ev.value);
    this.dateofBirth= moment(ev.value).format('YYYY-MM-DD');   
  }
  renewalType(val:any)
  {
    console.log(val.target.value);
    

  }
  checkDateOfBirth()
  {
    console.log(this.dateofBirth);
    let date_of_birth=new Date("1999-03-28");
    if(this.cm.isUndefineORNull(this.dateofBirth))
    {
      $('#doberror').html("Please enter date of birth");
      return false;
    }
    else{  
      $('#doberror').html(''); 
      let same = date_of_birth.getTime() === new Date(this.dateofBirth).getTime();  
      if(same)
      {
        this.showRenewal=true;
        this.getInsuredDetails();
      }
      else{
        this.showRenewal=false;
        Swal.fire('Oops...', "Birth Date is Mismatch!!!", 'error');
        return false;
      }
    }  
  }
  getInsuredDetails()
  {
    this.insureDetails=[{"insuredname":"test1","relationship":"SELF","insureddob":"1976-06-07T18:30:00.000Z","insureddiseas":"no","insuredgender":"Male","memberType":"adult"}
    ,{"insuredname":"test1","relationship":"SPOUSE","insureddob":"1978-06-13T18:30:00.000Z","insureddiseas":"no","insuredgender":"Female","memberType":"adult"}
    ,{"insuredname":"test1233","relationship":"SON","insureddob":"2006-10-10T18:30:00.000Z","insureddiseas":"no","insuredgender":"Male","memberType":"child"}
    ,{"insuredname":"test15434","relationship":"DAUGHTER","insureddob":"2018-10-11T18:30:00.000Z","insureddiseas":"no","insuredgender":"Female","memberType":"child"}]
  }
  getDiseaseList() {
    console.log("ok");
    this.cs.getWithParams('/api/healthmaster/GetHealthAilmentList?isAgent=YES').subscribe(res => {
      console.log("JSON Ailment", res.Details);
      this.questionList = res.Details;
    }, err => {
      console.log(err);
    });
  }
  showPED(ev:any)
  {
    console.log(ev);
    
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "500px";
    dialogConfig.width = "600px";
    dialogConfig.data = this.questionList;
    // https://material.angular.io/components/dialog/overview
 
    
    const modalDialog = this.matDialog.open(DiseaseModalComponent, dialogConfig);
    console.log(dialogConfig);
  }

}
