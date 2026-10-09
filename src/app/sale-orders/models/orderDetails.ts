import { ProductModel } from "src/app/stock/model/productModel";
import { SaleOrderModel } from "./saleOrder";

export class SaleOrderDetails {
  id!: number;
  productName!: string;
  productCode!: string;
  measurementUnit!: string;   // "METER" or "KILOGRAM"
  unitNumber!: number;        // e.g., 15
  price!: number;
  total!: number;
  quantity!: number;          // number of pieces (عدد الاتواب)
    returnCondition?: string;    // ✅ NEW – optional, 'GOOD' or 'DAMAGED'

}
