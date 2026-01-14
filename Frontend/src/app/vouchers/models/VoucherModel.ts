// Import the OrderModel interface from the OrderModel file
import { OrderModel } from "./OrderModel";


// Export the VoucherModel interface definition
export interface VoucherModel {
    // id property of type number
    id: number,
    // date property of type string
    date: string,
    // username property of type string
    userName: string | undefined,
    // customer property of type string
    customer: string,
    // orders property of type array of OrderModel
    orders : OrderModel[],
    // expanded property of type boolean
    expanded: boolean
}