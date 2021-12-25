import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CompoundService {

  private baseUrl = `${environment.baseUrl}/reports/compoundReport`;

  constructor(private http: HttpClient) {}

  getCompound(start: any,end:any): Observable<any> {
    return this.http.get(`${this.baseUrl}?start=${start}&end=${end}`);
  }
  
}
