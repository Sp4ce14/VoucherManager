import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../services/voucher-service';
import { VoucherModel } from '../models/VoucherModel';

@Component({
  selector: 'app-show-vouchers',
  templateUrl: './show-vouchers.component.html',
  styleUrls: ['./show-vouchers.component.css']
})
export class ShowVouchersComponent implements OnInit {

  public vouchers: VoucherModel[];
  constructor(private voucherService: VoucherService) {
    this.vouchers = this.voucherService.getVouchers();
  }

  ngOnInit(): void {
  }

  public toggleVoucher(index: number): void {
    if (this.vouchers[index].expanded) {
      this.vouchers[index].expanded = false;
    }
    else {
      this.vouchers[index].expanded = true;
    }
  }

  public deleteVoucher(index: number): void {
    if (confirm('Are you sure you want to delete this voucher?')) {
      this.vouchers.splice(index, 1);
    }
  }
}

