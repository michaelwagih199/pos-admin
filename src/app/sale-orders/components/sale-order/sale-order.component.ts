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

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit {

  quantityValidateForm!: FormGroup;
  arabic: Arabic = new Arabic();
  currentDate = new Date();
  paymentType!: string;
  orderType!: string;
  orderCode: any;


  searchType!: string;

  myControl = new FormControl();
  productControl = new FormControl();
  customer: CustomerModel = new CustomerModel();

  //for autocomplete
  options!: string[];
  filteredOptions!: Observable<string[]>;

  productOptions!: string[];
  productFilteredOptions!: Observable<string[]>;

  isLoading: boolean = false;
  isInstallment: boolean = false;
  searchCustomerInout = '';
  productSearchValue: string = '';
  installmentValue: any = 30;
  productSelectedSearchFilter!: string;

  dynamicOrderList: DynamicOrder[] = [];
  dynamcObjectSelected: DynamicOrder = new DynamicOrder();

  //calc
  totalValue: number = 0;
  paid: number = 0;
  discount: number = 0;
  modalquantity: number = 0;

  orderTypeId!: number;
  paymentTypeId!: number;

  IsorderType: boolean = true;
  IspaymentType: boolean = true;
  productSelected: any;

  //validate
  canOrder: any;
  canCustomer: boolean = true;
  canSelect = false;
  checkResponse: CheckitesResponse | undefined;
  orderPayload: OrderDetailsPayload = new OrderDetailsPayload();

  orderForm!: FormGroup;

  orderPayment: OrderPaymentModel = new OrderPaymentModel();

  categoryList!: CategoryModel[];
  productList!: ProductModel[];
  tailerTasksList!: TailerTasksModel[];


  constructor(
    private customerService: CustomerService,
    private dynamicItemService: DynamicItemService,
    private orderDetailsService: OrderDetailsService,
    private orderPaymentService: OrderPaymentService,
    private productService: ProductServiceService,
    private tailerTaskService: TailerTasksServiceService,
    private categoryService: CategoryServiceService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private modalService: NgbModal,
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
        this.filteredOptions = this.myControl.valueChanges.pipe(
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

  viewOrderToday() {

  }

  addToInvoce() {
    if (this.dynamcObjectSelected.categoryName && this.dynamcObjectSelected.task1 && this.dynamcObjectSelected.productName) {
      this.dynamcObjectSelected.total = this.dynamcObjectSelected.price * this.dynamcObjectSelected.quantity
      this.dynamicOrderList.push(this.dynamcObjectSelected)
      this.calcTotal()
    } else
      this.openSnackBar('اكمل البيانات', '')
    this.dynamcObjectSelected = new DynamicOrder()
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

  onSaveOrder() {
    if (this.canCustomer == true && this.searchCustomerInout == '') {
      this.openSnackBar('اختر العميل', '');
    } else {
      //saveOrder
      this.orderPayload.dynamicDetailsDaoList = this.dynamicOrderList;
      console.log(this.dynamicOrderList);
      this.orderPayment.discount = this.discount;
      this.orderPayment.netCost = this.totalValue - (this.discount + this.paid);
      if (this.paymentType == 'كاش') {
        this.orderPayment.paid = this.totalValue - (this.discount + this.paid);
        this.orderPayment.remaining =
          this.orderPayment.netCost - this.orderPayment.paid;
      } else {
        this.orderPayment.paid = this.paid;
        this.orderPayment.remaining =
          this.totalValue - this.discount - this.orderPayment.paid;
      }

      this.orderPayment.totalOrder = this.totalValue;

      this.orderService
        .createOrder(
          this.searchCustomerInout,
          this.orderTypeId,
          this.paymentTypeId
        )
        .subscribe(
          (data) => {
            this.orderDetailsService
              .createOrderDetails(this.orderCode, this.orderPayload)
              .subscribe();
            this.orderPaymentService
              .createOrderPayment(this.orderCode, this.orderPayment)
              .subscribe();
            this.openSnackBar('تم حفظ الطلب', '');
            this.reset();
          },
          (error) => console.log(error)
        );
    }
  }


  reset() {
    this.totalValue = 0;
    this.paid = 0;
    this.discount = 0;
    this.dynamicOrderList = [];
    this.orderType = '';
    this.paymentType = '';
    this.productSearchValue = '';
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

  onorderTypeChange(value: string) {
    this.orderType = value;
    this.IsorderType = false;
  }

  deleteDynamicItem(obj: any) {
    for (var i = 0; i < this.dynamicOrderList.length; i++) {
      if (this.dynamicOrderList[i] === obj) {
        this.dynamicOrderList.splice(i, 1);
      }
    }
    this.calcTotal();
  }

  openUpdateQuantity(content: any, obj: DynamicOrder) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalquantity = obj.quantity;
    this.dynamcObjectSelected = obj;
  }

  onupdateQuantity() {
    this.dynamicItemService
      .findDynamic(
        this.productSearchValue,
        this.paymentTypeId,
        this.orderTypeId,
        this.modalquantity,
        this.installmentValue
      )
      .subscribe((data) => {
        console.log(data);
        if (data.message === 'can Order') {
          this.dynamcObjectSelected.quantity = this.modalquantity;
          this.dynamcObjectSelected.total =
            this.dynamcObjectSelected.quantity *
            this.dynamcObjectSelected.price;
          this.modalService.dismissAll();
        } else if (data.message === 'Alert Quantity') {
          this.openSnackBar('البضاعة ستقل للحد الادنى ', '');
          this.canOrder = true;
        } else {
          this.openSnackBar('البضاعة لا تكفى', '');
          this.canOrder = true;
        }
        this.calcTotal();
      });
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

  private _filterproduct(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productOptions.filter((productOption) =>
      productOption.toLowerCase().includes(filterValue)
    );
  }

  openConfimation(title: any, confirmedFn: () => void) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: title,
        buttonText: {
          ok: `${this.arabic.util.dialogButtons.ok}`,
          cancel: `${this.arabic.util.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        confirmedFn();
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
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
      productValueControl: new FormControl({
        value: '',
        disabled: this.canOrder,
      }),
      color: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });

    // this.quantityValidateForm = this.fb.group({
    //   modalquantity: [this.modalquantity, [Validators.required]],
    // });
  }

  /**
   * accounting
   */

  calcTotal() {
    this.paid = 0;
    this.discount = 0;
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
