export interface ReturnableInvoiceLine {
  saleOrderDetailId?: number;
  purchasesBillDetailId?: number;
  orderCode: string;
  orderDate: string;
  returnableQty: number;      // rolls ceiling
  returnableUnits: number;    // units ceiling (m/kg)
  price?: number | null;      // source invoice line unit price
}

export interface ReturnableProduct {
  productId: number;
  productName: string;
  productCode?: string;
  measurementUnit?: 'METER' | 'KILOGRAM';
  availableUnits?: number;      // m/kg available to return
  availableCanvases?: number;   // pieces available to return
  unitNumber?: number;          // m/kg per canvas (from original invoice)
  lastPrice?: number;           // price on original invoice
  invoices?: ReturnableInvoiceLine[];
  totalPurchased?: number;
  totalReturned?: number;
}
