export interface DynamicOrderByCodeRequest {
    productCode: string
    paymentType: string
    orderType: string
    quantity: number
    installmentPercentage: number
    dynamicDetailsDao: DynamicDetailsDao[]
}

export interface DynamicOrderByNameRequest {
    productName: string
    paymentType: string
    orderType: string
    quantity: number
    installmentPercentage: number
    dynamicDetailsDao: DynamicDetailsDao[]
}

export class DynamicDetailsDao {
    productId!: number
    productName!: string
    productCode!: string
    quantity!: number
    price!: number
    total!: number
    unitType!: string
}
  