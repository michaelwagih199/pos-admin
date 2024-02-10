import { Component, Inject, OnInit } from '@angular/core';
import { OrderPaymentModel } from 'src/app/sale-orders/models/orderPayment';
import { Arabic } from 'src/app/text';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { POS_Response } from 'src/app/_helpers/pos-responce';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { DynamicSOrderType } from 'src/app/reports/models/dynamic-sale-order-type';
import { SaleOrderInvoceModel } from 'src/app/printing/model/saleOrderInvocesModel';
import { SaleOrderInvoceService } from 'src/app/printing/service/sale-order-invoce.service';
import { SalesRoportService } from 'src/app/reports/service/sales-roport.service';


interface data {
  orderType: DynamicSOrderType,
  customerId:any
}


@Component({
  selector: 'app-dynamic-orders',
  templateUrl: './dynamic-orders.component.html',
  styleUrls: ['./dynamic-orders.component.scss']
})
export class DynamicOrdersComponent{

  startDate: any;
  endDate: any;
  arabic: Arabic = new Arabic();
  invoceorderPrinting!: POS_Response<SaleOrderInvoceModel>


  orderCounter: number = 0;
  sumTotal: number = 0;

  ordersList!: OrderPaymentModel[];
  ordersDetailsList!: SaleOrderDetails[];

  constructor(
    private saleReport: SalesRoportService,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private router: Router,
    private dataServer: DataService,
    private orderServiceInvoce: SaleOrderInvoceService,
    private orderDetailsService: OrderDetailsService,
    private dialogRef: MatDialogRef<DynamicOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData: data
  ) {
    switch (dialogData.orderType) {
      case DynamicSOrderType.TODAY_ORDERS:
        this.getTodayReport();
        break;
      case DynamicSOrderType.CUSTOMERS_ORDERS:
        this.getCustomerReport(dialogData.customerId);
        break;
    }
  }

  getCustomerReport(customerId:any) {
    this.saleReport
      .getByCusromerId(customerId)
      .subscribe((data) => {
        this.ordersList = data.data;
        this.orderCounter = this.ordersList.length
        this.sumTotal = this.ordersList.map(a => a.totalOrder).reduce(function (a, b) {
          return a + b;
        });
      });
  }

  getTodayReport() {
    this.saleReport
      .getTodaySales()
      .subscribe((data) => {
        this.ordersList = data.data;
        this.orderCounter = this.ordersList.length
        this.sumTotal = this.ordersList.map(a => a.totalOrder).reduce(function (a, b) {
          return a + b;
        });
      });
  }


  details(content: any, item: OrderPaymentModel) {
    this.modalService.open(content, { size: 'xl' });
    this.orderDetailsService
      .getByCode(item.saleOrder.orderCode)
      .subscribe((data) => {
        this.ordersDetailsList = data;
      });
  }


  onPrinting(item: OrderPaymentModel){
    this.dialogRef.close(true);
    this.orderServiceInvoce.getSaleOrderInvoce(item.saleOrder.orderCode).subscribe(response => {
      this.invoceorderPrinting = response
      let dataServer = {
        orderCode: response.data.orderCode,
      };
      this.dataServer.changeMessage(dataServer);
    })
    this.redirectTo(`/printing/sale-order-invoice`);
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

}
