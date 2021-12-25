import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmailsNotificationService {

  private baseUrl = `${environment.baseUrl}/emails`;

  constructor(private http: HttpClient) {
    
  }

  createEmail(oblect:Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/saveEmail`, oblect);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllEmails`, );
  }
  
  deleteById(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/deleteEmail/${id}`, );
  }

  



}
