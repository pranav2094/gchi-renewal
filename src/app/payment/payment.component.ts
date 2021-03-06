import { Component, OnInit, NgZone } from '@angular/core';
import {CommonServicesService} from 'src/app/services/common-services.service'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';
import {CommonMethodsService} from 'src/app/services/common-methods.service'
import Swal from 'sweetalert2'
declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  insuranceAmountDetails: any;
  paymentMode: any;
  SavedPolicyResponse: any;
  policyDetails: any;
  paymentID: string | number;
  applicantDetails: any;
  baseURL: any; options: any;
  PolicyPremium: any;
  tenure:any;
  spinnerTxt:any;
  commonDataRes: any; childPageDetails: any;
  constructor(public cs: CommonServicesService, public ngZone: NgZone, public router: Router, public cm:CommonMethodsService) {

  }

  ngOnInit() {

   
    this.policyDetails = JSON.parse(localStorage.getItem("policyDetails"));
    this.SavedPolicyResponse = JSON.parse(localStorage.getItem('proposalResponse'));
    this.applicantDetails = JSON.parse(localStorage.getItem('applicantDetails'));
    this.baseURL = environment.baseURL;
    this.PolicyPremium=this.policyDetails.PolicyPremium;
    this.tenure =this.policyDetails.tenure;
    console.log(this.baseURL);
    
    this.ReceiveMessage = this.ReceiveMessage.bind(this);
    if (!window['postMessage']) {
      Swal.fire('', 'Something went wrong!', 'error');
      return;
    } else {
      if (window.addEventListener) {
        window.addEventListener("message", this.ReceiveMessage, false);
      } else {
        console.log("onmessage", this.ReceiveMessage);
        // window.attachEvent("onmessage", this.ReceiveMessage);
      }
    }
  }


  makePayment1(mode: any, ev: any) {
    this.beforeRazorPay().then(() => {
      this.payByRazorPay(this.commonDataRes, mode, ev, this.router);
    });

  }

  beforeRazorPay(): Promise<any> {
    return new Promise((resolve: any) => {
      let payBody = {
        "TransType": "POLICY_PAYMENT",
        "GatewayReturnURL": "",
        "PolicyIDs":"10162548",
        //"PolicyIDs": this.SavedPolicyResponse[0].PolicyID,
        "PayerType": "Customer",
        "ModeID": 0,
        "UserRole": "AGENT",
        "IPAddress": "ISECURITY-CGHI",
        "PaymentMode": "RAZORPAY",
        "PaymentAmount": ""
      };
      this.spinnerTxt = "Please wait... We are processing your request.";
      this.cm.showSpinner(true,this.spinnerTxt);
      let str = JSON.stringify(payBody);
      console.log("STR", str);
      localStorage.setItem('commonPayReq', str);
      this.cm.showSpinner(true,this.spinnerTxt);
      this.cs.postAPICallWithAuthToken('api/Payment/CommonPayment', str).subscribe(res => {
        console.log(res);
        this.commonDataRes = res;
        localStorage.setItem('payData', JSON.stringify(res));
        this.cm.showSpinner(false);
        resolve();
      }, err => {
        console.log("Error", err);
        this.cm.showSpinner(false);
        resolve();
      });
    });
  }

  payByRazorPay(res: any, type: any, ev: any, router: any): Promise<any> {
    return new Promise((resolve) => {
      this.spinnerTxt = "Please wait... We are processing your request";
      this.cm.showSpinner(true,this.spinnerTxt);
      var desc = "ICICI Lombard - " + 'Helath' + " Insurance";
      let self = this;
      let commonPaymentData = JSON.parse(localStorage.getItem('payData'));
      let paymentID = commonPaymentData.PaymentID;
      this.options = {
        "description": desc,
        "image": 'https://www.icicilombard.com/mobile/mclaim/images/favicon.ico',
        "currency": 'INR',
        "key": res.PublicKey,
        "order_id": res.RazorOrderID,
        "method": {
          "netbanking": {
            "order": ["ICIC", "HDFC", "SBIN", "UTIB", "IDFB", "IBKL"]
          }
        },
        "prefill": {
 
          email: this.applicantDetails.emailid,
          contact: this.applicantDetails.mobileNumber,
          name: this.applicantDetails.applicantName,
          method: type
        },
        "theme": {
          "color": '#043b6d',
          "hide_topbar": true
        },
        "handler": function (response: any) {
          console.log(response);

          let params = {
            "iPaymentID": paymentID,
            "PaymentID": response["razorpay_payment_id"],
            "OrderID": response["razorpay_order_id"],
            "Signature": response["razorpay_signature"]
          }
          console.log("Screen", screen.width, screen.height);
          let width = screen.width / 2;
          let height = screen.height / 2;
          let left = (screen.width - width) / 2;
          let top = (screen.height - height) / 4;
          console.log("PARAMS--------",params);
          
          let childWindow = window.open('#/razor-pay-fallback', 'Childwindow', 'status=0,toolbar=0,menubar=0,resizable=0,scrollbars=1,top=' + top + ' ,left=' + left + ',height=' + height + ',width=' + width + '');
          window['child'] = childWindow;
          window['router'] = router;
          if (!childWindow || childWindow.closed || typeof childWindow.closed == 'undefined') {
            window.open('#/razor-pay-fallback', "_self");
            window.postMessage({ 'razorPayDetails': params, 'url': self.baseURL + '/PaymentGateway/RazorPayPaymentProcess' }, 'http://localhost:4200/#/payment');
            //window.postMessage({ 'razorPayDetails': params, 'url': self.baseURL + '/PaymentGateway/RazorPayPaymentProcess' }, self.baseURL + '#/payment');
            return;
          }

          console.log("Child Window 1 ", childWindow);
          self.childPageDetails = childWindow;
          console.log("Child Window 2 ", self.childPageDetails);
          console.log("base url==", self.baseURL);

          childWindow.onload = (e) => {
            console.log("Child Window", e)
            if (childWindow == null || !window['postMessage']) {
              Swal.fire('Oops...', 'Something went wrong!', 'error')
            } else {
              childWindow.postMessage({ 'razorPayDetails': params, 'url': self.baseURL + '/PaymentGateway/RazorPayPaymentProcess' }, 'http://localhost:4200/#/payment');
              //childWindow.postMessage({ 'razorPayDetails': params, 'url': self.baseURL + '/PaymentGateway/RazorPayPaymentProcess' }, self.baseURL + '#/payment');
            }
          }
        }
      };
      console.log("razorPayOptions = ", this.options);
      var rzp1 = new Razorpay(this.options);

      rzp1.open();
      this.cm.showSpinner(false);
      resolve();
    });
  }
  ReceiveMessage(evt: any) {
    console.log("Receive Message", evt, this.baseURL);
    if (evt.origin != this.baseURL.substring(0, this.baseURL.lastIndexOf("/"))) {
      console.log(evt.origin);
      return;
    } else {
      var data = evt.data;
      window['child'].close();
      console.log("routing", window['router'], data);
      if (data.event == "razorpayResponse") {
        console.log("WINDOW123", JSON.parse(localStorage.getItem('planFormURL')));
        if (JSON.parse(localStorage.getItem('planFormURL')) == 'PID') {
          console.log("PID Route", this.router);
          window['router'].navigateByUrl('payment', { skipLocationChange: true }).then(() => {
            window['router'].navigateByUrl('pid');
            console.log("PID DATA", data);
            localStorage.setItem('isNewPIDReceivedData', 'true');
            localStorage.setItem('PIDReceiveData', JSON.stringify(data));
          });
        } else {
          console.log("PAYMENT Route", data);
          window['router'].navigateByUrl('razor-pay-confirmation');
          // window.location.href = '#/payment-confirmation';
          localStorage.setItem('razorPayData', JSON.stringify(data));
        }
      }
    }
  }
}
