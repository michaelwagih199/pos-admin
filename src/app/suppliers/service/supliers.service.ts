import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SupliersService {
  private http = inject(HttpClient);


  private baseUrl = `${environment.baseUrl}/suppliers`;  

  findAll():Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  findById(id:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAllPagination(params:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  getNames():Observable<any> {
    return this.http.get(`${this.baseUrl}/names`);
  }

  findByName(name:any):Observable<any> {
    return this.http.get(`${this.baseUrl}/supplierName?supplierName=${name}`);
  }

  search(term: string): Observable<any[]> {
    const params = new HttpParams().set('q', term);
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  getOrders(supplierId: number, params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${supplierId}/orders`, { params });
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
