import { DynamicDetailsDao } from "./dynamic-order-request"

export class OrderDetailsPayload {
    customerName:any
    orderCode:any
    paymentTypeId:any
    orderTypeId:any
    total:any
    dynamicDetailsList!: DynamicDetailsDao[]
}