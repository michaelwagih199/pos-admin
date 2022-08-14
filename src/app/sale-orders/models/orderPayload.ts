import { DynamicOrder } from './dynamicOrder';

export class OrderDetailsPayload {
    customerName:any
    orderCode:any
    paymentTypeId:any
    orderTypeId:any
    total:any
    dynamicDetailsList!: DynamicOrder[]
}