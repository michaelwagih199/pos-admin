import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface StatementOrderRow {
  orderCode: string;
  date: string;
  netCost: number;
}

export interface StatementPaymentRow {
  id: number;
  date: string;
  value: number;
  notes?: string;
}

export interface StatementRetrievalRow {
  id: number;
  code: string;
  date: string;
  totalCost: number;
  discount: number;
  netCost: number;
  refundMethod: string;
}

export interface CustomerStatement {
  customerId: number;
  customerName: string;
  customerPhone?: string;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  totalOrders: number;
  totalPayments: number;
  totalReturns: number;
  closingBalance: number;
  orders: StatementOrderRow[];
  payments: StatementPaymentRow[];
  retrievals: StatementRetrievalRow[];
}

@Injectable({ providedIn: 'root' })
export class CustomerStatementService {
  private baseUrl = `${environment.baseUrl}/reports/customer-statement`;

  constructor(private http: HttpClient) {}

  getStatement(customerId: number, from: string, to: string): Observable<CustomerStatement> {
    return this.http.get<CustomerStatement>(
      `${this.baseUrl}?customerId=${customerId}&from=${from}&to=${to}`
    );
  }


  getDetailedHtml(customerId: number, from: string, to: string): Observable<string> {
  return this.http.get(
    `${this.baseUrl}/detailed/html?customerId=${customerId}&from=${from}&to=${to}`,
    { responseType: 'text' }
  );
}

getDetailedJson(customerId: number, from: string, to: string): Observable<any> {
  return this.http.get(
    `${this.baseUrl}/detailed/json?customerId=${customerId}&from=${from}&to=${to}`
  );
}
}
