import { Injectable } from "@angular/core";
import { VoucherModel } from "../models/VoucherModel";
import { HttpClient } from "@angular/common/http";


@Injectable(
    {providedIn: "root"}
)

export class VoucherService {
    constructor(private http: HttpClient )
    {

    }
    private vouchers: VoucherModel[];

    public getVouchers(): VoucherModel[] {
        this.http.get<VoucherModel[]>("https://localhost:7175/api/Vouchers/").subscribe(x => this.vouchers = x);
        return this.vouchers;
    }
}