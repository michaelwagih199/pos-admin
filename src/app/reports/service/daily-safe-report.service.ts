import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DailySafeReport {
  date: string;
  customerPayments: number;
  cashSales: number;
  cashRetrievals: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class DailySafeReportService {
  private baseUrl = `${environment.baseUrl}/reports/safe/daily`;

  constructor(private http: HttpClient) {}

  getDailyReport(date: string): Observable<DailySafeReport> {
    return this.http.get<DailySafeReport>(`${this.baseUrl}?date=${date}`);
  }
}
