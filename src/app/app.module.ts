import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RenewalPolicyComponent } from './renewal-policy/renewal-policy.component';
import { MatDatepickerModule,MatInputModule,MatNativeDateModule,MAT_DATE_LOCALE} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwapComponent } from './swap/swap.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { DiseaseModalComponent } from './disease-modal/disease-modal.component';
import { PaymentComponent } from './payment/payment.component';
import { RazorPayConfirmationComponent } from './razor-pay-confirmation/razor-pay-confirmation.component';
import { RazorPayFallbackComponent } from './razor-pay-fallback/razor-pay-fallback.component';


@NgModule({
  declarations: [
    AppComponent,
    RenewalPolicyComponent,
    SwapComponent,
    DiseaseModalComponent,
    PaymentComponent,
    RazorPayConfirmationComponent,
    RazorPayFallbackComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
  entryComponents: [DiseaseModalComponent]
})
export class AppModule { }
