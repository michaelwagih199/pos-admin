import {
  AfterViewChecked,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { DynamicOrder } from 'src/app/sale-orders/models/dynamicOrder';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { OrderPaymentService } from 'src/app/sale-orders/service/order-payment.service';
import { OrderService } from 'src/app/sale-orders/service/order.service';
import { DataService } from 'src/app/shared/service/data.service';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';

export interface data {
  dynamicList: DynamicOrder[];
  date: any;
  discount: number;
  total: number;
  paid: number;
  code: any;
  customer: any;
  orderTypeId: any;
  paymentTypeId: any;
  orderPayload: any;
  orderPayment: any;
}

@Component({
  selector: 'app-recipt-report',
  templateUrl: './recipt-report.component.html',
  styleUrls: ['./recipt-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReciptReportComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  dynamicOrderList!: DynamicOrder[];

  subscription!: Subscription;

  sharedData!: data;

  constructor(
    private router: Router,
    private data: DataService,
    private orderDetailsService: OrderDetailsService,
    private orderPaymentService: OrderPaymentService,
    private orderService: OrderService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    window.print();
  }

  ngOnInit(): void {
    // this.printing();
    this.subscription = this.data.currentMessage.subscribe((message) => {
      this.sharedData = message;
      this.dynamicOrderList = this.sharedData.dynamicList;
    });
  }

  @HostListener('window:afterprint')
  onafterprint() {
    this.orderService
      .createOrder(
        this.sharedData.customer,
        this.sharedData.orderTypeId,
        this.sharedData.paymentTypeId
      )
      .subscribe(
        (data) => {
          this.orderDetailsService
            .createOrderDetails(
              this.sharedData.code,
              this.sharedData.orderPayload
            )
            .subscribe();
          this.orderPaymentService
            .createOrderPayment(
              this.sharedData.code,
              this.sharedData.orderPayment
            )
            .subscribe();
          this.openSnackBar('تم حفظ الطلب', '');
          // this.toSaleOrder('saleOrder');
        },
        (error) => console.log(error)
      );
  }

  @HostListener('window:beforeprint')
  onBeforePrint() {
    // this.toSaleOrder('saleOrder');
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  toSaleOrder(val: any) {
    this.redirectTo(`/${val}`);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
