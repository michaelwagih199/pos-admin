import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerPaymentService {
  private baseUrl = `${environment.baseUrl}/customerPayments`;

  constructor(private http: HttpClient) {} 

  findByCustomerId(params:any,customerId:any):Observable<any> {
    return this.http.get(`${this.baseUrl}/customer?customerId=${customerId}`, { params });
  } 
  
  createPayment(object: any,customerId:any): Observable<any>  {
    return this.http.post(`${this.baseUrl}?customerId=${customerId}`, object);
  }

  getAllPayment(customerId:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/totalPayment?customerId=${customerId}`);
  }

  getcustomerNetCostOrder(customerId:any): Observable<any>{
    //http://localhost:8080/api/customerPayments/customerNetCost?customerId=2
    return this.http.get(`${this.baseUrl}/customerNetCost?customerId=${customerId}`);
  }


  delete(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }


}
