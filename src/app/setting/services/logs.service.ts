import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LogsService {



  private baseUrl = `${environment.baseUrl}/userLogs`;

  constructor(private http: HttpClient) {
  }

  getAll(params): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { params });
  }

  getByUserId(params,userId:number):Observable<any>{
    return this.http.get(`${this.baseUrl}/user?userId=${userId}`, { params });
  }

  getByTypeId(params, typeId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/type?typeId=${typeId}`, { params });
  }

  getAllType():Observable<any> {
    return this.http.get(`${this.baseUrl}/logsType`);

  }

}
