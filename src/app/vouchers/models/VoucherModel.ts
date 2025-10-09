import { OrderModel } from "./ordermodel";


export interface VoucherModel {
    date: string,
    customer: string,
    orders : OrderModel[],
    expanded: boolean
}