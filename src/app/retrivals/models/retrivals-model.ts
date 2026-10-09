
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { Supplier } from 'src/app/suppliers/models/supplier';

export type ReturnType   = 'CUSTOMER' | 'SUPPLIER';
export type RefundMethod = 'CASH' | 'CREDIT';

export class RetrivalsModel {
  id!: number;
  retrievalsCode!: string;
  totalCost!: number;
  discount!: number;
  netCost!: number;
  createdDate!: string;

  returnType!: ReturnType;
  refundMethod?: RefundMethod;

  customer?: CustomerModel | null;
  supplier?: Supplier | null;
}
