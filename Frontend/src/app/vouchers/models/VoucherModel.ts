import { OrderModel } from "./OrderModel";


export interface VoucherModel {
    date: string,
    customer: string,
    orders : OrderModel[],
    expanded: boolean
}