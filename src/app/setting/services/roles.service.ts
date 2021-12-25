import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private baseUrl = `${environment.baseUrl}/auth/roles`;

  constructor(private http: HttpClient) {
  }

  getAllRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getPermissionRoles(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/rolePermissions/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
  }

  create(o: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, o);
  }


}
