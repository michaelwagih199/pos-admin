import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { POS_Response } from '../../_helpers/pos-responce';
import { DynamicOrderByCodeRequest, DynamicOrderByNameRequest } from '../models/dynamic-order-request';
import { DynamicOrderResponse } from '../models/dynamic-order-respopnse';

@Injectable({
  providedIn: 'root'
})
export class DynamicItemService {

  private baseUrl = `${environment.baseUrl}/dynamicDetails`;

  constructor(private http: HttpClient) { }

  findDynamicProductByCode(request: DynamicOrderByCodeRequest){
      return this.http.put<POS_Response<DynamicOrderResponse>>(`${this.baseUrl}/product/code`, request)
  }

  findDynamicByName(request:DynamicOrderByNameRequest){
      return this.http.put<POS_Response<DynamicOrderResponse>>(`${this.baseUrl}/product/name`, request)
  }

}
