import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RenewalPolicyComponent } from './renewal-policy/renewal-policy.component';
import { PolicyDataSyncComponent } from './policy-data-sync/policy-data-sync.component';
import { 
  AuthGuardService as AuthGuard 
} from 'src/app/auth-guard.service';


const routes: Routes = [{ path: '', component: PolicyDataSyncComponent, pathMatch: 'full'},
{ path: 'renewal-policy', component: RenewalPolicyComponent ,canActivate: [AuthGuard] },
{ path: '#', redirectTo: '/' }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
