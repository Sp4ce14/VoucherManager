import { OrderModel } from "./OrderModel";


export interface VoucherModel {
    id: number,
    date: string,
    customer: string,
    orders : OrderModel[],
    expanded: boolean
}