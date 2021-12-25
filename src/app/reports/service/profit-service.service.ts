import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfitServiceService {

  private baseUrl = `${environment.baseUrl}/reports/profits`;

  constructor(private http: HttpClient) {}

  getProfit(start: any,end:any): Observable<any> {
    return this.http.get(`${this.baseUrl}?start=${start}&end=${end}`);
  }
  

}
