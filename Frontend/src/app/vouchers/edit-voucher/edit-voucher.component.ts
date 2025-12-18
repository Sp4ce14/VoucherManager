import { Component } from '@angular/core';
import { VoucherService } from '../../services/voucher-service';
import { FormBuilder } from '@angular/forms';
import { VoucherBase } from '../voucher-base';
import { ActivatedRoute, Router } from '@angular/router';
import { VoucherModel } from '../models/VoucherModel';

@Component({
  selector: 'app-edit-voucher',
  templateUrl: './edit-voucher.component.html',
  styleUrls: ['./edit-voucher.component.css']
})
export class EditVoucherComponent extends VoucherBase {
  private currentVoucher: VoucherModel;
  private voucherId: number;
  constructor(public formBuilder1: FormBuilder, public voucherService1: VoucherService, public route: ActivatedRoute, public router: Router) {
    super(formBuilder1, voucherService1,);
  }

  override ngOnInit(): void {
    this.voucherId = <number><unknown>this.route.snapshot.paramMap.get('id')!;
  }

  public loadVoucher(): void {
    this.voucherService.getVoucher(this.voucherId).subscribe(
      {
        next: voucher => this.currentVoucher = voucher,
        error: err => console.log(err)
      }
    );
    this.voucherForm.patchValue(this.currentVoucher);
    for (let order of this.currentVoucher.orders) {
      this.items.push(order);
    }
  }


  public override saveVoucher(): void {
    if (this.voucherForm.get('date')?.value && this.voucherForm.get('customer')?.value) {
      if (confirm('Update voucher?')) {
        const updatedVoucher: any = {
          date: this.voucherForm.get('date')?.value,
          customer: this.voucherForm.get('customer')?.value,
          orders: this.items
        }
        this.voucherService.editVoucher(updatedVoucher, this.voucherId).subscribe(
          {
            next: res => alert("Voucher edited successfully"),
            error: err => console.log(err)
          }
          );
        this.router.navigate(['/vouchers/show-vouchers'])
      }
    }
  }
}
