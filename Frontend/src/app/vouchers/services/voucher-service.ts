import { Injectable } from "@angular/core";
import { VoucherModel } from "../models/VoucherModel";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable } from "rxjs";


@Injectable(
    {providedIn: "root"}
)

export class VoucherService {
    private baseUrl = "https://localhost:7175/api/";

    constructor(private http: HttpClient ) {}

    public getVouchers(): Observable<any> {
        return this.http.get(this.baseUrl + "Vouchers");
    }
    public addVoucher(voucherToSave: VoucherModel): Observable<any> {
        return this.http.post(this.baseUrl + "Vouchers", voucherToSave);
    }
    public deleteVoucher(voucherId: number): Observable<any> {
        return this.http.delete(this.baseUrl  + `Vouchers/${voucherId}`);
    }
    public getVoucher(voucherId: number): Observable<any>
    {
        return this.http.get(this.baseUrl + `Vouchers/${voucherId}`);
    }
}