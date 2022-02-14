import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TailerTasksServiceService {

  private baseUrl = `${environment.baseUrl}/tailerTasks`;

  constructor(private http: HttpClient) {}  

  findAll():Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
  create(object: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}`, object);
  }

  delete(id:any): Observable<any> {
    return this.http.put(`${this.baseUrl}/archive?id=${id}`,null);
  }
}
