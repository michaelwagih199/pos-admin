import { CategoryModel } from './categoryModel'

export class ProductModel {
  
    id!: number
    productCode: string ='automatic'
    productName!: string
    retailPrice: number = 0
    purchasingPrice: number = 0
    numberUnitsInStock: number = 0
    alertUnits: number = 0
    productCategory!: CategoryModel
    createdDate!: string 
    wholesalePrice: number =0
  }