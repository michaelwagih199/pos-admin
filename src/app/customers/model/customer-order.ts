export class CustomerOrderModel {
    orderId!: number
    orderCode!: string
    orderDate!: string
    totalOrder!: number
    paid!: number
    remaining!: number
    paymentType!: string
}

export class CustomerOrdersSummaryModel {
    totalOrders!: number
    totalOrderAmount!: number
    totalPaid!: number
    totalRemaining!: number
}

export class CustomerOrdersResponseModel {
    orders!: {
        content: CustomerOrderModel[]
        totalPages: number
        totalElements: number
        size: number
        number: number
        first: boolean
        last: boolean
        empty: boolean
    }
    totalOrders!: number
    totalOrderAmount!: number
    totalPaid!: number
    totalRemaining!: number
}
