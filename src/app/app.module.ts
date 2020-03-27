import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RenewalPolicyComponent } from './renewal-policy/renewal-policy.component';
import { MatDatepickerModule, MatNativeDateModule, MatInputModule, MAT_DATE_LOCALE} from '@angular/material';

import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PolicyDataSyncComponent } from './policy-data-sync/policy-data-sync.component';


@NgModule({
  declarations: [
    AppComponent,
    RenewalPolicyComponent,
    PolicyDataSyncComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
