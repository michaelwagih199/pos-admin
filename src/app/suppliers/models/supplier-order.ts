export class SupplierOrderModel {
    orderId!: number
    orderCode!: string
    orderDate!: string
    totalOrder!: number
    paid!: number
    remaining!: number
    paymentType!: string
}

export class SupplierOrdersSummaryModel {
    totalOrders!: number
    totalOrderAmount!: number
    totalPaid!: number
    totalRemaining!: number
}

export class SupplierOrdersResponseModel {
    orders!: {
        content: SupplierOrderModel[]
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
