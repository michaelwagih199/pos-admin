import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface SupplierMovementRow {
  date: string;
  refCode: string;
  type: string;
  description: string;
  amount: number;
  runningBalance: number;
}

export interface SupplierPurchaseRow {
  billCode: string;
  billDate: string;
  lineCount: number;
  total: number;
  paid: number;
  remaining: number;
}

export interface SupplierReturnRow {
  returnCode: string;
  sourceBillCode: string;
  returnDate: string;
  productName: string;
  rolls: number;
  units: number;
  unitLabel: string;
  unitPrice: number;
  lineTotal: number;
  refundMethod: string;
  refundMethodLabel: string;
  reason: string;
}

export interface SupplierPaymentRow {
  receiptCode: string;
  method: string;
  methodLabel: string;
  reference: string;
  date: string;
  amount: number;
}

export interface DetailedSupplierStatement {
  companyName: string;
  companyTagline: string;
  managerName: string;
  supplierCode: string;
  supplierName: string;
  supplierPhone: string;
  fromDate: string;
  toDate: string;

  openingBalance: number;
  totalPurchases: number;
  totalPayments: number;
  totalReturns: number;
  closingBalance: number;
  totalPurchasedRolls: number;
  totalPurchasedUnits: number;
  totalReturnsCash: number;
  totalReturnsCredit: number;

  movements: SupplierMovementRow[];
  purchases: SupplierPurchaseRow[];
  returns: SupplierReturnRow[];
  payments: SupplierPaymentRow[];
}

@Injectable({ providedIn: 'root' })
export class SupplierStatementService {
  private baseUrl = `${environment.baseUrl}/reports/supplier-statement`;

  constructor(private http: HttpClient) {}

  getDetailedHtml(supplierId: number, from: string, to: string): Observable<string> {
    return this.http.get(
      `${this.baseUrl}/detailed/html?supplierId=${supplierId}&from=${from}&to=${to}`,
      { responseType: 'text' }
    );
  }

  getDetailedJson(supplierId: number, from: string, to: string): Observable<DetailedSupplierStatement> {
    return this.http.get<DetailedSupplierStatement>(
      `${this.baseUrl}/detailed/json?supplierId=${supplierId}&from=${from}&to=${to}`
    );
  }
}
