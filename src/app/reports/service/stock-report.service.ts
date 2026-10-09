import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StockReportService {
  private baseUrl = `${environment.baseUrl}/reports/stock`;
  constructor(private http: HttpClient) {}

  getHtml(from: string, to: string): Observable<string> {
    return this.http.get(
      `${this.baseUrl}/html?from=${from}&to=${to}`,
      { responseType: 'text' });
  }

  getJson(from: string, to: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/json?from=${from}&to=${to}`);
  }
}
