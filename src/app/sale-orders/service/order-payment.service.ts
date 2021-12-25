import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderPaymentService {

  private baseUrl = `${environment.baseUrl}/saleOrdersPayments`;

  constructor(private http: HttpClient) { }

  createOrderPayment(orderCode:any,object: any):Observable<any>{
    return this.http.post(`${this.baseUrl}?orderCode=${orderCode}`,object);
  }

  getByCode(orderCode: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/orderCode?orderCode=${orderCode}`);
  }

}
