import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PurchasingBillsDetailsService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.baseUrl}/purchasesBillsDetails`;

  getAllByBillId(id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
