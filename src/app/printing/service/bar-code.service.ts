import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarCodeService {
  private http = inject(HttpClient);


  private baseUrl = `${environment.baseUrl}/report/barcode`;


  printBarCode(productId: any): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/pdf/${productId}`, { responseType: "blob" });
  }
}
