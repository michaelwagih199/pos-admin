import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) {
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createUser(user: Object, selectedRolesValue: number): Observable<Object> {
    return this.http.post(`${this.baseUrl}/auth/signup?roleId=${selectedRolesValue}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`,'')
  }



}
