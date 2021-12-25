import { CategoryModel } from './categoryModel'

export class ProductModel {
    id!: number
    productCode!: string
    productName!: string
    retailPrice!: number
    purchasingPrice!: number
    numberUnitsInStock!: number
    alertUnits!: number
    productCategory!: CategoryModel
    createdDate!: string
    wholesalePrice!: number
  }