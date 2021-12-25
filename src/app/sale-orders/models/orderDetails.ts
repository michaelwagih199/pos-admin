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
}
  