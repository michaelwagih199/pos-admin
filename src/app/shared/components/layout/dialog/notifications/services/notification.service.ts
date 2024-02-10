import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { POS_Response } from "src/app/_helpers/pos-responce";
import { ExpiredProductModel } from "../models/notification-model";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private baseUrl = `${environment.baseUrl}/notifications`;

  constructor(private http: HttpClient) { }

  getExpiredProduct(): Observable<POS_Response<ExpiredProductModel[]>> {
    return this.http.get<POS_Response<ExpiredProductModel[]>>(`${this.baseUrl}/product/expired`);
  }
}
