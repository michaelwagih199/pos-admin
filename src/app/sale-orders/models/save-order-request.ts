import { DynamicDetailsDao } from "./dynamic-order-request"

export interface SaveOrderRequest {
  customerName:string
    orderCode: string
    total: number
    discountAmount: number
    paidAmount: number
    paymentType: string
    orderType: string
    dynamicDetailsList: DynamicDetailsDao[]
  }