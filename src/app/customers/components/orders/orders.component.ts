import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { CustomerOrderModel } from '../../model/customer-order';
import { AppConstants } from 'src/app/_helpers/constants';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Arabic } from 'src/app/text';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatFormField, MatLabel, MatInput, MatSuffix } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
    imports: [MatProgressBar, MatFormField, MatLabel, MatInput, MatDatepickerInput, ReactiveFormsModule, FormsModule, MatDatepickerToggle, MatSuffix, MatDatepicker, MatButton, MatDivider, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, NgxPaginationModule, DatePipe]
})
export class OrdersComponent implements OnInit {
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private orderDetailsService = inject(OrderDetailsService);


  private routeSub!: Subscription;
  arabic: Arabic = new Arabic()
  customerId!: number
  isLoading: boolean = false

  customerOrderList: CustomerOrderModel[] = []
  ordersDetailsList!: SaleOrderDetails[]
  totalOrders: number = 0
  totalOrderAmount: number = 0
  totalPaid: number = 0
  totalRemaining: number = 0

  startDate: any
  endDate: any

  //for tables
  displayedColumns: string[] = ['orderCode', 'orderDate', 'totalOrder', 'paid', 'remaining', 'paymentType', 'details']

  ngOnInit(): void {
    this.getCustomerId()
    this.retriveOrders()
  }

  getCustomerId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.customerId = params['id']
    });
  }

  retriveOrders() {
    this.isLoading = true
    const params = this.getRequestParams(this.page, this.pageSize);
    if (this.startDate) {
      params['fromDate'] = this.formatDate(this.startDate);
    }
    if (this.endDate) {
      params['toDate'] = this.formatDate(this.endDate);
    }
    this.customerService.getOrders(this.customerId, params)
      .subscribe(
        data => {
          this.isLoading = false
          this.customerOrderList = data.data.orders.content
          this.count = data.data.orders.totalElements
          this.totalOrders = data.data.totalOrders
          this.totalOrderAmount = data.data.totalOrderAmount
          this.totalPaid = data.data.totalPaid
          this.totalRemaining = data.data.totalRemaining
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }

  search() {
    this.page = 1
    this.retriveOrders()
  }

  resetFilters() {
    this.startDate = null
    this.endDate = null
    this.page = 1
    this.retriveOrders()
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  translatePaymentType(paymentType: string): string {
    return AppConstants.translate(paymentType) || paymentType;
  }

  details(content: any, item: CustomerOrderModel) {
    this.modalService.open(content, { size: 'lg' });
    this.orderDetailsService.getByCode(item.orderCode).subscribe(data => {
      this.ordersDetailsList = data;
    }, error => console.log(error));
  }

  page = 1;
  count = 0;
  pageSize = 5;

  handlePageChange(event: any) {
    this.page = event;
    this.retriveOrders();
  }

  getRequestParams(page: any, pageSize: any) {
    // tslint:disable-next-line:prefer-const
    let params: any = {};
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }

}
