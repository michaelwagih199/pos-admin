import { ProductModel } from "src/app/stock/model/productModel"
import { RetrivalsModel } from "./retrivals-model"

// src/app/retrivals/models/retrivals-details-model.ts
export class RetrivalsDetailsModel {
  id!: number;
  productId!: number;
  productName!: string;
  productCode!: string;

  // Dual Unit Tracking
  quantity!: number;           // Number of Canvases/Pieces (rolls)
  unitNumber!: number;         // Total meters/kg for this line (NOT per-roll)

  price!: number;
  total!: number;

  // Condition & Reason
  returnCondition!: 'GOOD' | 'DAMAGED';
  returnReason?: string;       // DEFECT, WRONG_ITEM, EXPIRED, etc.

  // Traceability (Optional - populated if user selects specific invoice line)
  sourceSaleOrderDetailId?: number;
  sourcePurchasesBillDetailId?: number;
}
