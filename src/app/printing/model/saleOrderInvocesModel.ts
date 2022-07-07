import { SaleOrderDetails } from "src/app/sale-orders/models/orderDetails"

export interface SaleOrderInvoceModel {
    reciveDate: string
    orderDate: string
    orderCode: string
    customerName: string
    orderPaymentOrder: string
    saleOrderDetails: SaleOrderDetails[]
    totalPrice: number
  }