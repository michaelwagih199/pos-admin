import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetrivalsDetailsService {

  private baseUrl = `${environment.baseUrl}/retrievalsDetails`;

  constructor(private http: HttpClient) { }
  
  create(object: any,billsCode:any,productCode:any): Observable<any>  {
    return this.http.post(`${this.baseUrl}?billsCode=${billsCode}&productCode=${productCode}`, object);
  }

  getAllByBillId(id:any): Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
