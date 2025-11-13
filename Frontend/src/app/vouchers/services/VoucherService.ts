import { Injectable } from "@angular/core";
import { VoucherModel } from "../models/VoucherModel";



@Injectable(
    {providedIn: "root"}
)

export class VoucherService {
    public MOCK_VOUCHERS: VoucherModel[] = [
        {
            date: '2025-10-09',
            customer: 'Ali Khan',
            expanded: false,
            orders: [
                { item: 'Laptop', quantity: 1, price: 150000 },
                { item: 'Mouse', quantity: 2, price: 2500 },
                { item: 'Keyboard', quantity: 1, price: 4000 },
            ],
        },
        {
            date: '2025-10-07',
            customer: 'Sara Ahmed',
            expanded: false,
            orders: [
                { item: 'Smartphone', quantity: 1, price: 95000 },
                { item: 'Earbuds', quantity: 1, price: 8500 },
            ],
        },
        {
            date: '2025-10-05',
            customer: 'Hassan Raza',
            expanded: false,
            orders: [
                { item: 'Desk Chair', quantity: 2, price: 18000 },
                { item: 'Office Table', quantity: 1, price: 25000 },
                { item: 'Lamp', quantity: 2, price: 3500 },
            ],
        },
        {
            date: '2025-10-03',
            customer: 'Fatima Noor',
            expanded: false,
            orders: [
                { item: 'Air Conditioner', quantity: 1, price: 145000 },
                { item: 'Remote Batteries', quantity: 2, price: 300 },
            ],
        },
    ];

    public getVouchers(): VoucherModel[] {
        return this.MOCK_VOUCHERS;
    }

    public addVoucher(voucher: VoucherModel): void {
        this.MOCK_VOUCHERS.push(voucher);
    }

    public getSingleVoucher(index: number): VoucherModel {
        return this.MOCK_VOUCHERS[index];
    }
}