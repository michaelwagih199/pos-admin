import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private baseUrl = `${environment.baseUrl}/googleSheet`;

  constructor(private http: HttpClient) {
    
  }

  exportPatient(): Observable<any> {
    return this.http.get(`${this.baseUrl}/exportDb`);
  } 
  exportCycles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/exportCycles`);
  } 
  exportApprovalCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/exportApprovalCode`);
  }

  importPatient(): Observable<any> {
    return this.http.get(`${this.baseUrl}/toDb`);
  }

  importApprovalCode(): Observable<any> {
    return this.http.get(`${this.baseUrl}/importApprovalCode`);
  }


}
