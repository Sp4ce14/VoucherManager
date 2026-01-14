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
  private currentVoucher!: VoucherModel;
  private voucherId!: number;
  constructor(public formBuilder1: FormBuilder, public voucherService1: VoucherService, public route: ActivatedRoute, public router: Router) {
    super(formBuilder1, voucherService1);
  }

  override ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    this.voucherId = idStr ? Number(idStr) : NaN;
    if (isNaN(this.voucherId)) {
      console.error('Invalid voucher id:', idStr);
      return;
    }
    this.loadVoucher();
  }
     private formatDateForInput(date: string): string {
    return date ? date.split('T')[0] : '';
  }

  public loadVoucher(): void {
    this.voucherService.getVoucher(this.voucherId).subscribe(
      {
        next: voucher => {
          this.currentVoucher = voucher;
          this.voucherForm.patchValue({ customer: this.currentVoucher.customer,
             date: this.formatDateForInput(this.currentVoucher.date) 
            });
          for (let order of this.currentVoucher.orders) {
            this.items.push(order);
          }
        },
        error: err => console.log(err)
      }
    );
  }

  public override saveVoucher(): void {
    if (this.voucherForm.get('date')?.value && this.voucherForm.get('customer')?.value) {
      if (confirm('Update voucher?')) {
        const updatedVoucher: VoucherModel = {
          id: this.voucherId,
          date: this.voucherForm.get('date')?.value,
          customer: this.voucherForm.get('customer')?.value,
          orders: this.items,
          expanded: this.currentVoucher.expanded,
          userName: undefined
        }
        this.voucherService.editVoucher(updatedVoucher, this.voucherId).subscribe(
          {
            next: res => {
              alert("Voucher edited successfully");
              this.router.navigate(['/vouchers/show-vouchers']);
            },
            error: err => console.log(err)
          }
        );
      }
    }
  }
}
