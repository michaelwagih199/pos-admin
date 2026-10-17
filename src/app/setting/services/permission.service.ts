import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private http = inject(HttpClient);


  private baseUrl = `${environment.baseUrl}/auth/permission`;

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  create(o: Object, selectedRolesValue: number): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, o);
  }
  
}
