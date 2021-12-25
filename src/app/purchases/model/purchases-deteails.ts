import { PurchasesBills } from './purchases-bills'
import { ProductModel } from 'src/app/stock/model/productModel'

export class PurchasesBillsDetails {
    id!: number
    itemQuantity!: number
    itemPrice!: number
    total!: number
    purchasesBill!: PurchasesBills
    product!: ProductModel
    createdDate: any
}