import { Component, OnInit } from '@angular/core';
import { CommonServicesService } from 'src/app/services/common-services.service'
import { CommonMethodsService} from 'src/app/services/common-methods.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-razor-pay-confirmation',
  templateUrl: './razor-pay-confirmation.component.html',
  styleUrls: ['./razor-pay-confirmation.component.scss']
})
export class RazorPayConfirmationComponent implements OnInit {
  razorPayData: any;
  paymentConfRes: any;
  commonPaymentRes: any;
  constructor(public cs: CommonServicesService, public cm:CommonMethodsService) { }

  ngOnInit() {
    this.razorPayData = JSON.parse(localStorage.getItem('payData'));
    this.paymantConfirmation(this.razorPayData);
  }


  paymantConfirmation(data: any): Promise<any> {
    return new Promise((resolve) => {
      let msg: any;
      this.cs.getUserData('api/Payment/CommonPaymentConfirmationByPID?EPaymentID=' + data.EPaymentID).then((res: any) => {
        console.log(res);
        this.commonPaymentRes = res;
        this.paymentConfRes = res.ConfirmPolicy[0];
        if (res.Message) {
          msg = res.Message;
          //this.presentAlert(msg);
          Swal.fire(msg);
          localStorage.setItem('isNewPIDReceivedData', 'false');
          resolve();
        } else {
          if (res.PaymentStatus == 'Successful Payment') {
            console.log("PAyment succ");
            msg = 'Payment is Successful. Your Transaction ID is ' + res.TransactionID;
            Swal.fire("Success", msg, "success");
          } else if (res.PaymentStatus == 'Pending Payment') {
            msg = 'Your Cheque details saved successfully';
            Swal.fire(msg);
          } else if (res.PaymentStatus == 'Failed Payment') {
            if (res.GatewayError != '' || res.GatewayError != null) {
              msg = 'Payment is Unsuccessful. Message: ' + data.GatewayError;
              Swal.fire(msg);
            } else {
              msg = 'Payment is Unsuccessful. Please Try again';
              Swal.fire(msg);
            }
          } else {
            msg = 'Payment is Cancelled. Please Try again';
            Swal.fire(msg);
          }
          localStorage.setItem('isNewPIDReceivedData', 'false');
          resolve();
        }
      });
    });

  }

  downloadPdf(ev: any) {
    let downloadURL;
    downloadURL = this.cs.pdfDownload('POLICY', this.paymentConfRes.EPolicyID);
    this.cm.save(downloadURL, this.paymentConfRes.ProposalNumber + ".pdf");

    // window.open(downloadURL, "_blank");
    Swal.fire("Success", "Your pdf will be downloaded", "success");
    // this.presentToast('Your pdf will be downloaded');
  }
}
