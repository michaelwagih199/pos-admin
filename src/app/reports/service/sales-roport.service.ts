import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { POS_Response } from 'src/app/_helpers/pos-responce';
import { OrderPaymentModel } from 'src/app/sale-orders/models/orderPayment';

@Injectable({
  providedIn: 'root'
})
export class SalesRoportService {

  private baseUrl = `${environment.baseUrl}/reports/sales`;

  constructor(private http: HttpClient) {}

  getSales(start: any,end:any): Observable<any> {
    return this.http.get(`${this.baseUrl}?start=${start}&end=${end}`);
  }
  
  getTodaySales(): Observable<POS_Response<OrderPaymentModel[]>> {
    return this.http.get<POS_Response<OrderPaymentModel[]>>(`${this.baseUrl}/today`);
  }
  
  getByCusromerId(customerId:any): Observable<POS_Response<OrderPaymentModel[]>> {
    return this.http.get<POS_Response<OrderPaymentModel[]>>(`${this.baseUrl}/customer/${customerId}`);
  }
  
}
