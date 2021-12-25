import { CustomerModel } from "src/app/customers/model/customer-model"
import { OrderPaymentModel } from "./orderPayment"

export class SaleOrderModel {
    id: number | undefined
    orderCode: string | undefined
    orderDate: any
    customer: CustomerModel | undefined
    orderType: OrderType | undefined
    paymentType: OrderPaymentModel | undefined
    createdDate: string | undefined
  }

  export interface OrderType {
    id: number
    orderType: string
  }
