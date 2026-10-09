export interface ReturnableProduct {
  productId: number;
  productName: string;
  productCode?: string;
  measurementUnit?: 'METER' | 'KILOGRAM';
  availableUnits?: number;      // m/kg available to return
  availableCanvases?: number;   // pieces available to return
  unitNumber?: number;          // m/kg per canvas (from original invoice)
  lastPrice?: number;           // price on original invoice
  invoices?: Array<{            // optional: original invoice lines
    saleOrderDetailId?: number;
    purchasesBillDetailId?: number;
    orderCode: string;
    orderDate: string;
    returnableQty: number;              // rolls ceiling
    returnableUnits?: number;           // ← NEW: units ceiling
  }>;
  totalPurchased?: number;
  totalReturned?: number;
}
