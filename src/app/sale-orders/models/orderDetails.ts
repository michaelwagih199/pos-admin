import { ProductModel } from "src/app/stock/model/productModel";
import { SaleOrderModel } from "./saleOrder";

export class SaleOrderDetails {
  id!: number;
  quantity!: number;
  price!: number;
  total!: number;
  product!: ProductModel;
  saleOrder!: SaleOrderModel;
  createdDate!: string;
  task1: string | undefined
  task2: string | undefined
  task3: string | undefined
  task4: string | undefined
  task5: string | undefined
  color: string | undefined
  notes: string | undefined
}
  