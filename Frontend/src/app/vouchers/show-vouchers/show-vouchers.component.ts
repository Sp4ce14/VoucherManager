import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../../services/voucher-service';
import { VoucherModel } from '../models/VoucherModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-vouchers',
  templateUrl: './show-vouchers.component.html',
  styleUrls: ['./show-vouchers.component.css']
})
export class ShowVouchersComponent implements OnInit {

  public vouchers: VoucherModel[];
  constructor(private voucherService: VoucherService, private router: Router) { 
    this.voucherService.getVouchers().subscribe(vouchers => {this.vouchers = vouchers; console.log(vouchers)});
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
      console.log(this.vouchers[index]);
      this.voucherService.deleteVoucher(this.vouchers[index].id).subscribe(x => console.log(x));
      this.vouchers.splice(index, 1);
    }
  }

  public editVoucher(index: number): void {
    this.router.navigate(['vouchers/edit-voucher/' + this.vouchers[index].id]);
  }
}

