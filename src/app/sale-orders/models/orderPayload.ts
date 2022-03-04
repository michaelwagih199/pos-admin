import { DynamicOrder } from './dynamicOrder';

export class OrderDetailsPayload {
    receivedDate:any
    customerName:any
    orderCode:any
    paymentTypeId:any
    total:any
    dynamicDetailsList!: DynamicOrder[]
}