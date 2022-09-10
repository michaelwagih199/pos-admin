import { DynamicDetailsDao } from "./dynamic-order-request"

export interface DynamicOrderResponse {
    dynamicDetailsDao: DynamicDetailsDao[]
    numberOfProduct: number
    totalPrice: number
    message: string
    code: number
  }