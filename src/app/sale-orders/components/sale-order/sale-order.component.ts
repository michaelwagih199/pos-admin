import { Component, OnInit } from '@angular/core';
import { Arabic } from 'src/app/text';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCustomerComponent } from 'src/app/customers/dialogs/create-customer/create-customer.component';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { DynamicOrder } from '../../models/dynamicOrder';
import { DynamicItemService } from '../../service/dynamic-item.service';
import { OrderService } from '../../service/order.service';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';
import { OrderDetailsService } from '../../service/order-details.service';
import { CheckitesResponse } from '../../models/checkitems';
import { OrderDetailsPayload } from '../../models/orderPayload';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { OrderPaymentService } from '../../service/order-payment.service';
import { OrderPaymentModel } from '../../models/orderPayment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { AppConstants } from '../../../_helpers/constants';
import { CategoryServiceService } from 'src/app/stock/service/category-service.service';
import { CategoryModel } from 'src/app/stock/model/categoryModel';
import { ProductModel } from 'src/app/stock/model/productModel';
import { TailerTasksModel } from 'src/app/stock/model/tailer-taskMode';
import { TailerTasksServiceService } from 'src/app/stock/service/tailer-tasks-service.service';
import { DatePipe } from '@angular/common';
import { DynamicOrdersComponent } from '../../../reports/dialog/dynamic-orders/dynamic-orders.component';
import { SalesRoportService } from 'src/app/reports/service/sales-roport.service';
import { DynamicSOrderType } from 'src/app/reports/models/dynamic-sale-order-type';
import { OrderType } from '../../models/saleOrder';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit {

  saveOrderForm!: FormGroup;
  arabic: Arabic = new Arabic();
  orderCode: any
  customerControl = new FormControl();
  currentDate = new Date()
  customer: CustomerModel = new CustomerModel();

  //for autocomplete
  options!: string[];
  filteredOptions!: Observable<string[]>;

  productOptions!: string[];

  productFilteredOptions!: Observable<string[]>;

  isLoading: boolean = false;
  searchCustomerInout = '';

  dynamicOrderList: DynamicOrder[] = [];
  dynamcObjectSelected: DynamicOrder = new DynamicOrder();

  //calc
  totalValue: number = 0;



  //validate
  orderPayload: OrderDetailsPayload = new OrderDetailsPayload();
  pipe = new DatePipe('en-US');

  orderForm!: FormGroup;

  orderPayment: OrderPaymentModel = new OrderPaymentModel();

  categoryList!: CategoryModel[];
  productList!: ProductModel[];
  tailerTasksList!: TailerTasksModel[];


  constructor(
    private customerService: CustomerService,
    private productService: ProductServiceService,
    private tailerTaskService: TailerTasksServiceService,
    private categoryService: CategoryServiceService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private dataServer: DataService
  ) { }

  ngOnInit(): void {
    this.getAllNames();
    this.getOrderCode();
    this.validateform();
    this.retrieveAllProductCatogery()
    this.retrieveTailerTasks()
  }

  /**
   * data
   */

  getAllNames() {
    this.customerService.getNames().subscribe(
      (response) => {
        this.options = response;
        this.filteredOptions = this.customerControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  retrieveAllProductCatogery() {
    this.isLoading = true
    this.categoryService.findAll()
      .subscribe(
        data => {
          this.isLoading = false
          this.categoryList = data;
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }



  retrieveTailerTasks() {
    this.tailerTaskService.findAll()
      .subscribe(
        response => {
          this.tailerTasksList = response.data;
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }

  getOrderCode() {
    this.isLoading = true;
    this.orderService.getOrderCode().subscribe(
      (data) => {
        console.log(data);
        this.isLoading = false;
        this.orderCode = data.data;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }





  /**
   * event
   */

  search() {
    this.findCustomerByName();
  }

  addProductCategory(item: CategoryModel) {
    this.dynamcObjectSelected.categoryName = item.categoryName
    this.isLoading = true
    this.productService.findByCategoryId(item.id).subscribe(response => {
      this.isLoading = false;
      this.productList = response.data
    }, error => console.log(error))
  }

  addProduct(item: ProductModel) {
    this.dynamcObjectSelected.productName = item.productName
    this.dynamcObjectSelected.productCode = item.productCode
    this.dynamcObjectSelected.productId = item.id
  }

  task: Array<string> = []
  addCard(item: TailerTasksModel) {
    if (this.task.length != 5 && !this.task.includes(item.task)) {
      this.task.push(item.task)
    }
    this.dynamcObjectSelected.task1 = this.task[0]
    this.dynamcObjectSelected.task2 = this.task[1]
    this.dynamcObjectSelected.task3 = this.task[2]
    this.dynamcObjectSelected.task4 = this.task[3]
    this.dynamcObjectSelected.task5 = this.task[4]
  }

  viewOrderToday(): void {
    const dialogRef = this.dialog.open(DynamicOrdersComponent, {
      width: '80%',
      data: { orderType: DynamicSOrderType.TODAY_ORDERS },
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


  addToInvoce() {
    console.log(this.dynamcObjectSelected);

    if (this.dynamcObjectSelected.categoryName && this.dynamcObjectSelected.task1 && this.dynamcObjectSelected.productName) {
      this.dynamcObjectSelected.total = this.dynamcObjectSelected.price * this.dynamcObjectSelected.quantity
      this.dynamicOrderList.push(this.dynamcObjectSelected)
      this.calcTotal()
    } else {
      this.openSnackBar('اكمل البيانات', '')
    }
    this.dynamcObjectSelected = new DynamicOrder()
    this.dynamcObjectSelected.notes = ''
    this.task = []
  }

  refresh() {
    this.redirectTo(`/saleOrder`);
  }

  findCustomerByName() {
    //check items
    this.isLoading = true;
    this.customerService.findByName(this.searchCustomerInout).subscribe(
      (data) => {
        this.isLoading = false;
      },
      (error) => console.log(error)
    );
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchCustomerInout = SelectedHuman;
    this.findCustomerByName();
  }

  displayFn(value: any): string {
    console.log(value);
    this.searchCustomerInout = value;
    return value;
  }

  // order methods
  onSaveOrder() {
    if (this.isOrderValid()) {
      this.calcTotal()
      this.isLoading = true
      //saveOrder
      this.saveOrder()
      this.openSnackBar(this.arabic.util.saved, '')
    } else {
      this.openSnackBar('اكمل البيانات', '');
    }
  }

  onSaveAndPrint() {
    if (this.isOrderValid()) {
      this.calcTotal()
      this.isLoading = true
      //saveOrder and print
      this.saveOrder()
      this.printOrder()
    } else {
      this.openSnackBar('اكمل البيانات', '');
    }
  }

  isOrderValid(): boolean {
    if (this.searchCustomerInout && this.orderPayload.receivedDate && this.dynamicOrderList.length > 0)
      return true;
    else
      return false;
  }


  saveOrder() {
    this.orderPayload.receivedDate = this.pipe.transform(this.orderPayload.receivedDate, 'yyyy-MM-dd');
    this.orderPayload.customerName = this.searchCustomerInout
    this.orderPayload.dynamicDetailsList = this.dynamicOrderList
    this.orderPayload.orderCode = this.orderCode
    this.orderPayload.total = this.totalValue
    this.orderService.createBoutiqueOrder(this.orderPayload).subscribe(response => {
      if (response.code == 'CREATED') {

        this.refresh()
        this.isLoading = false
      }
    }, err => console.log(err))
  }

  printOrder() {
    let data = {
      dynamicList: this.dynamicOrderList,
      date: this.currentDate,
      total: this.totalValue,
      code: this.orderCode,
      customer: this.searchCustomerInout,
      orderPayload: this.orderPayload,
    };

    this.dataServer.changeMessage(data);
    this.redirectTo(`/printing`);
  }

  reset() {
    this.totalValue = 0;
    this.dynamicOrderList = [];
    this.dynamcObjectSelected = new DynamicOrder()

    this.getOrderCode();
  }

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      model: this.customer,
    };
    this.dialog.open(CreateCustomerComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateCustomerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      this.customerService.create(data.customerModel).subscribe(
        (data) => {
          this.openSnackBar(`${this.arabic.util.saved}`, '');
          this.getAllNames();
        },
        (error) => console.log(data)
      );
    });
  }


  deleteDynamicItem(obj: any) {
    for (var i = 0; i < this.dynamicOrderList.length; i++) {
      if (this.dynamicOrderList[i] === obj) {
        this.dynamicOrderList.splice(i, 1);
      }
    }
    this.calcTotal();
  }




  /**
   * uiux
   */

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }


  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  /**
   * validate
   */

  validateform() {
    this.orderForm = this.fb.group({
      color: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      note: [null,],
    });

    this.saveOrderForm = this.fb.group({
      receivedDate: [null, [Validators.required]],
      paymentTypeId: [null, [Validators.required]],
    });
  }

  /**
   * accounting
   */

  calcTotal() {
    if (this.dynamicOrderList.length == 0) {
      this.totalValue = 0;
    } else {
      this.totalValue = this.dynamicOrderList
        .map((a) => a.total)
        .reduce(function (a, b) {
          return a + b;
        });
    }
  }
}
