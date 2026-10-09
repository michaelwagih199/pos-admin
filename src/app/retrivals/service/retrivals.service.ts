import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReturnType } from '../models/retrivals-model';

@Injectable({ providedIn: 'root' })
export class RetrivalsService {
  private baseUrl = `${environment.baseUrl}/retrievals`;

  constructor(private http: HttpClient) {}

  getAllPagination(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  getBillsCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

  getReturnableProducts(personId: number, type: ReturnType): Observable<any> {
    const params: any = type === 'CUSTOMER'
      ? { customerId: personId }
      : { supplierId: personId };
    return this.http.get(`${this.baseUrl}/returnable-products`, { params });
  }

  createRetrieval(payload: any, personId: number, type: ReturnType): Observable<any> {
    const params: any = type === 'CUSTOMER'
      ? { customerId: personId }
      : { supplierId: personId };
    return this.http.post(`${this.baseUrl}/createRetrivalBills`, payload, { params });
  }

  delete(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }
}
