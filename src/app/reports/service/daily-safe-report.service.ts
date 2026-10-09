import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CustomerPaymentRow {
  receiptCode: string;
  customerName: string;
  customerPhone?: string;
  paymentDate: string;
  reference: string;
  amount: number;
}

export interface CashSaleRow {
  invoiceCode: string;
  customerName: string;
  customerPhone?: string;
  paymentType?: string;
  orderDate: string;
  amount: number;
}

export interface CashRetrievalRow {
  returnCode: string;
  partyName: string;
  partyPhone?: string;
  returnType?: string;
  returnDate: string;
  reason: string;
  netCost: number;
}

export interface PurchasesBillRow {
  billCode: string;
  supplierName: string;
  supplierPhone?: string;
  billDate: string;
  paid: number;
  remaining: number;
  total: number;
}

export interface DailySafeReport {
  date: string;
  customerPayments: number;
  cashSales: number;
  totalSales: number;
  cashRetrievals: number;
  totalRetrievals: number;
  totalPurchases: number;
  total: number;
  customerPaymentsDetails: CustomerPaymentRow[];
  cashSalesDetails: CashSaleRow[];
  cashRetrievalsDetails: CashRetrievalRow[];
  purchasesDetails: PurchasesBillRow[];
}

@Injectable({ providedIn: 'root' })
export class DailySafeReportService {
  private baseUrl = `${environment.baseUrl}/reports/safe/daily`;

  constructor(private http: HttpClient) {}

  getDailyReport(date: string): Observable<DailySafeReport> {
    return this.http.get<DailySafeReport>(`${this.baseUrl}?date=${date}`);
  }
}
