import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { AddVoucherComponent } from './add-voucher/add-voucher.component';
import { EditVoucherComponent } from './edit-voucher/edit-voucher.component';
import { ShowVouchersComponent } from './show-vouchers/show-vouchers.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFormatPipe } from '../date-format.pipe';


@NgModule({
  declarations: [
    AddVoucherComponent,
    EditVoucherComponent,
    ShowVouchersComponent, DateFormatPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VouchersRoutingModule
  ]
})
export class VouchersModule { }
