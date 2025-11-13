import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { VoucherService } from '../services/VoucherService';
import { VoucherBase } from '../voucher-base';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.css']
})
export class AddVoucherComponent extends VoucherBase {

  constructor(public formBuilder2: FormBuilder, public voucherService2: VoucherService, public router: Router) {
    super(formBuilder2, voucherService2);
  }
  override ngOnInit(): void {

  }
  public override saveVoucher(): void {
    if (this.voucherForm.get('date')?.value && this.voucherForm.get('customer')?.value) {
      if (confirm('Save voucher?')) {
        const voucher: any = {
          date: this.voucherForm.get('date')?.value,
          customer: this.voucherForm.get('customer')?.value,
          orders: this.items
        }
        this.voucherService.addVoucher(voucher);
        this.router.navigate(['/vouchers/show-vouchers'])
      }
    }
  }
}
