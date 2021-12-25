import { CustomerModel } from './customer-model';

export class CustomerPaymentModel {
    id!: number
    paymentDate!: string
    paymentValue!: number
    notes!: string
    customer!: CustomerModel
    createdDate!: string
}