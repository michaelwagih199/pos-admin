import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { POS_Response } from '../../_helpers/pos-responce';
import { SaleOrderInvoceModel } from '../model/saleOrderInvocesModel';

@Injectable({
  providedIn: 'root'
})
export class SaleOrderInvoceService {

  private baseUrl = `${environment.baseUrl}/report/sale-order-invoice`;

  constructor(private http: HttpClient) { }

  getSaleOrderInvoce(orderCode:any): Observable<POS_Response<SaleOrderInvoceModel>> {
    return this.http.get<POS_Response<SaleOrderInvoceModel>>(`${this.baseUrl}/sale-order/${orderCode}`);
  }


}
