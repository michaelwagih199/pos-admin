import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  

  private baseUrl = `${environment.baseUrl}/products`;

  constructor(private http: HttpClient) {}  

  findAll():Observable<any> {
    return this.http.get(`${this.baseUrl}/active`);
  }

  getAllPagination(params:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/pageable`, { params });
  }

  findPagable():Observable<any>{
    return this.http.get(`${this.baseUrl}`);
  }

  getNames():Observable<any> {
    return this.http.get(`${this.baseUrl}/names`);
  }

  getCodes():Observable<any> {
    return this.http.get(`${this.baseUrl}/codes`);
  }

  findByName(name:any):Observable<any> {
    return this.http.get(`${this.baseUrl}/productName?productName=${name}`);
  }

  findByCode(searchInout: any):Observable<any> {
    return this.http.get(`${this.baseUrl}/productCode?productCode=${searchInout}`);
  }

  create(object: any,categoryId:number): Observable<any>  {
    return this.http.post(`${this.baseUrl}?categoryId=${categoryId}`, object);
  }

  update(productId:number, object: Object,categoryId:number): Observable <any> {
    return this.http.put(`${this.baseUrl}?productId=${productId}&categoryId=${categoryId}`, object);
  }

  delete(id:number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`,null);
  }

}
