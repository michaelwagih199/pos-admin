import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface CollectorReportRow {
  customerId: number;
  customerName: string;
  customerPhone?: string;
  lastPaymentDate: string | null;
  collectedAmount: number;
  totalRemainingDebt: number;
}

@Injectable({ providedIn: 'root' })
export class CollectorReportService {
  private baseUrl = `${environment.baseUrl}/reports/collector`;

  constructor(private http: HttpClient) {}

 getReport(): Observable<CollectorReportRow[]> {
    return this.http.get<CollectorReportRow[]>(this.baseUrl);
  }
}
