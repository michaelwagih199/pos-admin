import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = `${environment.baseUrl}/saleOrders`;

  constructor(private http: HttpClient) { }

  getOrderCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

  createOrder(
    customerName: any,
    orderTypeId: any,
    paymentTypeId: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}?customerName=${customerName}&orderTypeId=${orderTypeId}&paymentTypeId=${paymentTypeId}`,
      {}
    );
  }

  createBoutiqueOrder(orderObj:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/boutique/save`, orderObj);
  }



  delete(id: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }


}
