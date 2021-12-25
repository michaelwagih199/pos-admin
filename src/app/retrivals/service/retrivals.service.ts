import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetrivalsService {

  private baseUrl = `${environment.baseUrl}/retrievals`;

  constructor(private http: HttpClient) { }

  getAllPagination(params:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  getBillsCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/nextCode`);
  }

  create(object: any,orderCode:any): Observable<any>  {
    return this.http.post(`${this.baseUrl}?orderCode=${orderCode}`, object);
  }

  delete(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }

}
