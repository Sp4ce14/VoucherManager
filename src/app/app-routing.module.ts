import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacycompComponent } from './privacycomp/privacycomp.component';

const routes: Routes = [
  {path: 'vouchers', loadChildren: () => import('./vouchers/vouchers.module').then(m => m.VouchersModule)},
  {path: '', redirectTo: 'vouchers', pathMatch: "full"},
  {path: 'privacy', component: PrivacycompComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
