import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SafeService {
  
  private baseUrl = `${environment.baseUrl}/reports/safe`;

  constructor(private http: HttpClient) {}

  getIncomeReport(start: any,end:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/income?start=${start}&end=${end}`);
  }

  getExportReport(start: any,end:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/export?start=${start}&end=${end}`);
  }


}
