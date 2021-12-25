import { SaleOrderModel } from './saleOrder';

export class OrderPaymentModel {
  id!: number;
  netCost!: number;
  totalOrder!: number;
  paid!: number;
  remaining!: number;
  discount!: number;
  saleOrder!: SaleOrderModel;
  createdDate!: string;
}
