import { ProductModel } from "src/app/stock/model/productModel"
import { RetrivalsModel } from "./retrivals-model"

export class RetrivalsDetailsModel {
    id!: number
    quantity!: number
    price!: number
    total!: number
    product!: ProductModel
    retrievalsBills!: RetrivalsModel
    createdDate!: string
  }