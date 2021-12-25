import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { POS_Response } from '../../_helpers/pos-responce';


@Injectable({
  providedIn: 'root'
})

export class MaintanenceService {
  

  private baseUrl = `${environment.baseUrl}/maintenance`;

  constructor(private http: HttpClient) {}  

  findAll():Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
  findTomorrow():Observable<any> {
    return this.http.get(`${this.baseUrl}/tomorrow`);
  }
  
  findToday():Observable<any> {
    return this.http.get(`${this.baseUrl}/today`);
  }
  

  getNames():Observable<any> {
    return this.http.get(`${this.baseUrl}/names`);
  }

  findByName(name:any):Observable<any> {
    return this.http.get(`${this.baseUrl}/customer?customerName=${name}`);
  }

  create(object: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}`, object);
  }

  isHaveMaintenance():Observable<any> {
    return this.http.get(`${this.baseUrl}/isHaveMaintenance`);
  }

  update(id:number, object: Object): Observable <any> {
    return this.http.put(`${this.baseUrl}/${id}`, object);
  }

  delete(id:number): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`,null);
  }

}
