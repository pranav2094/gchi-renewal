import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RenewalPolicyComponent } from './renewal-policy/renewal-policy.component';
import { PolicyDataSyncComponent } from './policy-data-sync/policy-data-sync.component';
import { 
  AuthGuardService as AuthGuard 
} from 'src/app/services/auth-guard.service';
import { PaymentComponent } from './payment/payment.component';
import { RazorPayConfirmationComponent } from './razor-pay-confirmation/razor-pay-confirmation.component';
import { RazorPayFallbackComponent } from './razor-pay-fallback/razor-pay-fallback.component';


const routes: Routes = [{ path: '', component: PolicyDataSyncComponent, pathMatch: 'full'},
{ path: 'renewal-policy', component: RenewalPolicyComponent ,canActivate: [AuthGuard] },
{ path: 'payment', component: PaymentComponent,canActivate: [AuthGuard]},
{ path: 'razor-pay-confirmation', component: RazorPayConfirmationComponent ,canActivate: [AuthGuard]},
{ path: 'razor-pay-fallback',component:RazorPayFallbackComponent ,canActivate: [AuthGuard]},
{ path: '#', redirectTo: '/' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
