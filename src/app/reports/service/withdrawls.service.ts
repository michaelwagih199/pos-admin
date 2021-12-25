import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WithdrawlsService {

  private baseUrl = `${environment.baseUrl}/safe/withdrawals`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  create(object: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}`, object);
  }

  update(id:number, object: Object): Observable <any> {
    return this.http.put(`${this.baseUrl}/${id}`, object);
  }

  delete(id:number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }

}
