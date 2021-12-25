import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private baseUrl = `${environment.baseUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAllPagination(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  create(object: any, categoryId: any): Observable<any> {
    return this.http.post(`${this.baseUrl}?categoryId=${categoryId}`, object);
  }

  update(id:number, object: Object): Observable <any> {
    return this.http.put(`${this.baseUrl}/${id}`, object);
  }

  delete(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`, null);
  }
}
