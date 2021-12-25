import { CategoryModel } from 'src/app/stock/model/categoryModel'

export class ExpensessModel {
    id!: number
    expensesName!: string
    expensesValue!: number
    notes!: string
    expensesCategory!: CategoryModel
    createdDate!: string
    expensesDate!: any
}
