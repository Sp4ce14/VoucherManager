import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVoucherComponent } from './add-voucher/add-voucher.component';
import { EditVoucherComponent } from './edit-voucher/edit-voucher.component';
import { ShowVouchersComponent } from './show-vouchers/show-vouchers.component';

const routes: Routes = [
  {path: 'show-vouchers', component: ShowVouchersComponent},
  {path: 'add-voucher', component: AddVoucherComponent},
  {path: 'edit-voucher/:id', component: EditVoucherComponent},
  {path: '', redirectTo: 'show-vouchers', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
