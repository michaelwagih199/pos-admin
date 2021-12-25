import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SupliersPaymentService {

  private baseUrl = `${environment.baseUrl}/supplierPayments`;

  constructor(private http: HttpClient) { }

  findById(params: any, supplierId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/supplier?supplierId=${supplierId}`, { params });
  }

  createPayment(object: any, supplierId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}?supplierId=${supplierId}`, object);
  }

  getAllPayment(supplierId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/totalPayment?supplierId=${supplierId}`);
  }

  delete(id:number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }

}
