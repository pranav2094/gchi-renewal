import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {CommonServicesService} from 'src/app/services/common-services.service';
import { CommonMethodsService } from 'src/app/services/common-methods.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-policy-data-sync',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss']
})
export class SwapComponent implements OnInit {

  spinnerTxt:any;
  constructor(public router:Router,public activeRoute:ActivatedRoute,public cs:CommonServicesService,public cm:CommonMethodsService) { }

  ngOnInit(): void {
    localStorage.clear();
    let policyno = this.activeRoute.snapshot.queryParams.policyno;
    this.validatePolicy(decodeURIComponent(policyno));
   
  }
  validatePolicy(policyNo:any)
  {
    if(policyNo==='undefined')
    {
      Swal.fire('Oops...', "Policy Number is invalid", 'error');
      return false;
    }
    this.spinnerTxt = "Please wait... We are fetching policy details."
    this.cm.showSpinner(true,this.spinnerTxt);
    let policyData;
    let payload = {
      "EpolicyNo":policyNo
    };
    let payLoadStr = JSON.stringify(payload);
    this.cs.postWithParams('api/health/ValidatePolicyNoGCHIRenewal', payLoadStr).subscribe((res) => {
    this.cm.showSpinner(false);
    if(res.StatusCode ==1)
    { 
      localStorage.basicAuth = res.BasicAuth;
      policyData={
        'PolicyNumber': res.PolicyNumber,
        'CustDob':res.CustDob,
        'DealID':res.DealID
      }
      localStorage.setItem("policyDetails",JSON.stringify(policyData))
      this.router.navigateByUrl('/renewal-policy');
    }
    else{
      Swal.fire(res.StatusMessage, res.StatusDescription, 'error');
      return false;

    }
    });
  }

}
