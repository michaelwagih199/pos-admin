export interface DynamicOrderByCodeRequest {
  productCode: string;
  quantity: number;
  canvasTopUnits: number;
  searchBy: string;
  dynamicDetailsDao: DynamicDetailsDao[];
}

export interface DynamicOrderByNameRequest {
  productName: string;
  quantity: number;
  canvasTopUnits: number;
  searchBy: string;
  dynamicDetailsDao: DynamicDetailsDao[];
}


export class DynamicDetailsDao {
  productId!: number;
  productName!: string;
  productCode!: string;
  quantity!: number;         // final quantity (same as canvasTopUnits)
  price!: number;
  total!: number;
  unitType!: string;
  // New fields
  measurementUnit!: string;  // e.g., "METER" or "KILOGRAM"
  unitNumber!: number;       // e.g., 15
}
