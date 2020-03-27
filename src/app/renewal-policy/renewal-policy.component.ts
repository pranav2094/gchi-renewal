import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CommonMethodsService } from 'src/app/common-methods.service';
import Swal from 'sweetalert2';
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
 
  constructor(public cm:CommonMethodsService) { }

  ngOnInit(): void {
    var today = new Date();
    
    this.memmaxDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 21));
    this.meminDOBHB = new Date(today.setFullYear(new Date().getFullYear() - 75));
    this.memmaxDOBHB = moment(this.memmaxDOBHB).format('YYYY-MM-DD');
    this.meminDOBHB = moment(this.meminDOBHB).format('YYYY-MM-DD');
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
    let date_of_birth=new Date("1999-03-27");
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
        Swal.fire('Oops...', "Birth Date is mismatch !", 'error');
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

}
