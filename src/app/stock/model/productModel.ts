import { CategoryModel } from './categoryModel'

export class ProductModel {
  id!: number
  productCode!: string
  productName!: string
  retailPrice!: number
  purchasingPrice!: number
  alertUnits!: number
  productCategory!: CategoryModel
  createdDate!: string
  expirationDate!: string
  wholesalePrice!: number
  measurementUnit!: string;
   numberUnitsInStock!: number;
    numberOfCanvasesInStock!: number;
}
