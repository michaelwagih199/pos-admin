import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SmsNotificationService {

  private baseUrl = `${environment.baseUrl}/Sms`;

  constructor(private http: HttpClient) {
    
  }

  createNumber(oblect:Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/addNumber`, oblect);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/allNumbers`, );
  }
  

  deleteById(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/deleteNumber/${id}`, );
  }
  

}
