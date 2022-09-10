import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaveOrderRequest } from '../models/save-order-request';
import { POS_Response } from 'src/app/_helpers/pos-responce';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.baseUrl}/saleOrders`;

  constructor(private http: HttpClient) {}

  getOrderCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

  createOrder(request:SaveOrderRequest){
    return this.http.post<POS_Response<void>>(`${this.baseUrl}/save`,request);
  }
  
  delete(id: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }


}
