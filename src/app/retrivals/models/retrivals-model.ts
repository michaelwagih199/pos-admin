import { CustomerModel } from "src/app/customers/model/customer-model";

export class RetrivalsModel {
  id!: number;
  retrievalsCode!: string;
  totalCost!: number;
  discount!: number;
  netCost!: number;
  customer!: CustomerModel;
  createdDate!: string;
}
