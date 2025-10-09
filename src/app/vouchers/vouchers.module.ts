import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { AddVoucherComponent } from './add-voucher/add-voucher.component';
import { EditVoucherComponent } from './edit-voucher/edit-voucher.component';
import { ShowVouchersComponent } from './show-vouchers/show-vouchers.component';


@NgModule({
  declarations: [
    AddVoucherComponent,
    EditVoucherComponent,
    ShowVouchersComponent
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule
  ]
})
export class VouchersModule { }
