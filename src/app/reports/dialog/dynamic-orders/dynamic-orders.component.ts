import { Component, Inject, OnInit } from '@angular/core';
import { OrderPaymentModel } from 'src/app/sale-orders/models/orderPayment';
import { Arabic } from 'src/app/text';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { SalesRoportService } from '../../service/sales-roport.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { CreateCustomerComponent } from 'src/app/customers/dialogs/create-customer/create-customer.component';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicSOrderType } from '../../models/dynamic-sale-order-type';
import { ChangeStatuesComponent } from '../change-statues/change-statues.component';
import { SaleOrderInvoceModel } from 'src/app/printing/model/saleOrderInvocesModel';
import { POS_Response } from 'src/app/_helpers/pos-responce';
import { Router } from '@angular/router';
import { SaleOrderInvoceService } from 'src/app/printing/service/sale-order-invoce.service';
import { DataService } from 'src/app/shared/service/data.service';

interface data {
  orderType: DynamicSOrderType,
  customerId:any
}

@Component({
  templateUrl: './dynamic-orders.component.html',
  styleUrls: ['./dynamic-orders.component.scss']
})
export class DynamicOrdersComponent {

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

  onChangeStatus(item: OrderPaymentModel){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data ={
      orderId: item?.saleOrder?.id
    }
    const dialogRef =this.dialog.open(ChangeStatuesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      () => {
        this.getTodayReport()
      }
    );
  }

  onPrinting(item: OrderPaymentModel){
    this.dialogRef.close(true);
    this.orderServiceInvoce.getSaleOrderInvoce(item.saleOrder.orderCode).subscribe(response => {
      this.invoceorderPrinting = response
      this.dataServer.changeMessage(response);
    })
    this.redirectTo(`/printing`);
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

}
