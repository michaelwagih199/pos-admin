import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SupliersService } from '../../service/supliers.service';
import { SupplierOrderModel } from '../../models/supplier-order';
import { AppConstants } from 'src/app/_helpers/constants';
import { PurchasingBillsDetailsService } from 'src/app/purchases/service/purchasing-bills-details.service';
import { PurchasesBillsDetails } from 'src/app/purchases/model/purchases-deteails';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Arabic } from 'src/app/text';

@Component({
  selector: 'app-supplier-orders',
  templateUrl: './supplier-orders.component.html',
  styleUrls: ['./supplier-orders.component.scss']
})
export class SupplierOrdersComponent implements OnInit {

  private routeSub!: Subscription;
  arabic: Arabic = new Arabic()
  supplierId!: number
  isLoading: boolean = false

  supplierOrderList: SupplierOrderModel[] = []
  ordersDetailsList!: PurchasesBillsDetails[]
  totalOrders: number = 0
  totalOrderAmount: number = 0
  totalPaid: number = 0
  totalRemaining: number = 0

  startDate: any
  endDate: any

  //for tables
  displayedColumns: string[] = ['orderCode', 'orderDate', 'totalOrder', 'paid', 'remaining', 'paymentType', 'details']

  constructor(
    private supliersService: SupliersService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private purchasingBillsDetailsService: PurchasingBillsDetailsService,
  ) { }

  ngOnInit(): void {
    this.getSupplierId()
    this.retriveOrders()
  }

  getSupplierId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.supplierId = params['id']
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
    this.supliersService.getOrders(this.supplierId, params)
      .subscribe(
        data => {
          this.isLoading = false
          this.supplierOrderList = data.data.orders.content
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

  details(content: any, item: SupplierOrderModel) {
    this.modalService.open(content, { size: 'lg' });
    this.purchasingBillsDetailsService.getAllByBillId(item.orderId).subscribe(data => {
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
