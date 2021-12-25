import { Supplier } from './supplier'

export class SupplierPayment {
    id!: number
    paymentDate!: string
    paymentValue!: number
    notes!: string
    mySupplier!: Supplier
    createdDate!: string
}
