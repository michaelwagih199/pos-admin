export interface DynamicOrderByCodeRequest {
  productCode: string;
  quantity: number;
  canvasTopUnits: number;
  searchBy: string;
  dynamicDetailsDao: DynamicDetailsDao[];
  customPrice?: number | null;
}

export interface DynamicOrderByNameRequest {
  productName: string;
  quantity: number;
  canvasTopUnits: number;
  searchBy: string;
  dynamicDetailsDao: DynamicDetailsDao[];
  customPrice?: number | null;
}


export class DynamicDetailsDao {
  productId!: number;
  productName!: string;
  productCode!: string;
  quantity!: number;        // Number of canvases
  price!: number;
  total!: number;
  unitType!: string;
  measurementUnit!: string;
  unitNumber!: number;      // Meters/kg per canvas
}
