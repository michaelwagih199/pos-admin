import { Component, Inject, OnInit } from '@angular/core';
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
import { DynamicItemService } from '../../service/dynamic-item.service';
import { OrderService } from '../../service/order.service';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';
import { CheckitesResponse } from '../../models/checkitems';
import { OrderDetailsPayload } from '../../models/orderPayload';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { OrderPaymentModel } from '../../models/orderPayment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { AppConstants } from '../../../_helpers/constants';
import { DynamicOrdersComponent } from '../../../reports/components/dialog/dynamic-orders/dynamic-orders.component';
import { DynamicSOrderType } from 'src/app/reports/models/dynamic-sale-order-type';
import { OrderTypeRequest, PaymentTypeRequest } from '../../models/ordersrequest';
import { DynamicDetailsDao, DynamicOrderByCodeRequest, DynamicOrderByNameRequest } from '../../models/dynamic-order-request';
import { SaveOrderRequest } from '../../models/save-order-request';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})
export class SaleOrderComponent implements OnInit {

  quantityValidateForm!: FormGroup;
  arabic: Arabic = new Arabic();
  currentDate = new Date();
  myControl = new FormControl();
  productControl = new FormControl();
  customer: CustomerModel = new CustomerModel();
  options!: string[];
  filteredOptions!: Observable<string[]>;
  productOptions!: string[];
  productFilteredOptions!: Observable<string[]>;
  elem: any;

  saleOrderObj = {
    orderCode: '',
    orderType: '',
    paymentType: '',
    searchType: '',
    productSelected: '',

    flags: {
      isLoading: false,
      isInstallment: false,
      IsorderType: true,
      IspaymentType: true,
      canSelect: false,
      canCustomer: true,
    },
    dataLake: {
      orderTypeList: [
        { 'key': this.arabic.saleOrder.util.orderTypeSelection.wholesale, value: OrderTypeRequest.WHOLESALE },
        { 'key': this.arabic.saleOrder.util.orderTypeSelection.retailseal, value: OrderTypeRequest.RETAIL },
      ],
      paymentType: [
        { 'key': this.arabic.saleOrder.util.paymentTypeSelection.cash, value: PaymentTypeRequest.CASH },
        { 'key': this.arabic.saleOrder.util.paymentTypeSelection.installment, value: PaymentTypeRequest.INSTALLMENT },
        { 'key': this.arabic.saleOrder.util.paymentTypeSelection.oncredit, value: PaymentTypeRequest.CREDIT },
      ],
    }
  }

  var_arabic = {
    orderType: '',
    paymentType: '',
  }

  //for autocomplete
  searchCustomerInout = '';
  productSearchValue: string = '';
  installmentValue: any = 30;
  productSelectedSearchFilter!: string;

  dynamicOrderList: DynamicDetailsDao[] = [];
  dynamcObjectSelected: DynamicDetailsDao = new DynamicDetailsDao();

  //calc
  totalValue: number = 0;
  paid: number = 0;
  discount: number = 0;
  modalquantity: number = 0;

  //validate
  canOrder: any;
  checkResponse: CheckitesResponse | undefined;
  orderPayload: OrderDetailsPayload = new OrderDetailsPayload();

  producForm!: FormGroup;

  orderPayment: OrderPaymentModel = new OrderPaymentModel();

  constructor(
    private customerService: CustomerService,
    private dynamicItemService: DynamicItemService,
    private productService: ProductServiceService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private dataServer: DataService,

  ) { }

  ngOnInit(): void {
    this.getAllNames();
    this.getOrderCode();
    this.getProductNames();
    this.validateform();

  }

  /**
   * data
   */

  getAllNames() {
    this.customerService.getNames().subscribe(
      (response: string[]) => {
        this.options = response;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getOrderCode() {
    this.saleOrderObj.flags.isLoading = true;
    this.orderService.getOrderCode().subscribe(
      (data: any) => {
        console.log(data);
        this.saleOrderObj.flags.isLoading = false;
        this.saleOrderObj.orderCode = data;
      },
      (error: any) => {
        this.saleOrderObj.flags.isLoading = false;
        console.log(error);
      }
    );
  }

  getProductNames() {
    this.productService.getNames().subscribe(
      (response: string[]) => {
        this.productOptions = response;
        this.productFilteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterproduct(value))
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getProductCodes() {
    this.productService.getCodes().subscribe(
      (response: string[]) => {
        this.productOptions = response;
        this.productFilteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterproduct(value))
        );
      },
      (error: any) => {
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

  onSearchFilterChange(value: string) {
    if (value == 'name') {
      this.getProductNames();
      this.productSearchValue = '';
      this.saleOrderObj.searchType = AppConstants.SEARCH_BY_NAME
    } else {
      this.productSearchValue = '';
      this.getProductCodes();
      this.saleOrderObj.searchType = AppConstants.SEARCH_BY_CODE
    }
  }

  OnProductSelected(productSelected: any) {
    this.productSearch(productSelected);

  }

  onProductEnter(productSelected: any) {

    this.productSearch(productSelected);
  }

  viewOrderToday(): void {
    const dialogRef = this.dialog.open(DynamicOrdersComponent, {
      width: '80%',
      height: '80%',
      data: { orderType: DynamicSOrderType.TODAY_ORDERS },
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  productSearch(searchKey: any) {


    if (this.saleOrderObj.paymentType && this.saleOrderObj.orderCode) {

      switch (this.saleOrderObj.searchType) {
        case AppConstants.SEARCH_BY_CODE:
          this.findDynamicPyCode(this.saleOrderObj.paymentType, this.saleOrderObj.orderType, searchKey, 1);
          break;
        case AppConstants.SEARCH_BY_NAME:
          this.findDynamicPyName(this.saleOrderObj.paymentType, this.saleOrderObj.orderType, searchKey);
          break;
      }
    } else {
      this.openSnackBar('اختر نوع الطلب وطريقة الدفع', '');
    }
  }



  refresh() {
    this.redirectTo(`/saleOrder`);
  }


  findDynamicPyCode(paymentType: any, orderType: any, productCode: any, quantity: number) {

    let request: DynamicOrderByCodeRequest = {
      dynamicDetailsDao: this.dynamicOrderList,
      installmentPercentage: this.installmentValue,
      orderType: orderType,
      paymentType: paymentType,
      productCode: productCode,
      quantity: quantity
    };

    this.dynamicItemService.findDynamicProductByCode(request).subscribe(response => {
      this.saleOrderObj.flags.isLoading = true;
      this.dynamicOrderList = response.data.dynamicDetailsDao;
      this.saleOrderObj.flags.isLoading = false;
      this.totalValue = response.data.totalPrice
      if (response.data.code != 200) {
        let message = AppConstants.translate(response.data.message)
        this.openSnackBar(message, '');
      }
    })

  }



  findDynamicPyName(paymentType: any, orderType: any, productName: any) {

    let request: DynamicOrderByNameRequest = {
      dynamicDetailsDao: this.dynamicOrderList,
      installmentPercentage: this.installmentValue,
      orderType: orderType,
      paymentType: paymentType,
      productName: productName,
      quantity: 1
    };

    this.dynamicItemService.findDynamicByName(request).subscribe(response => {
      this.saleOrderObj.flags.isLoading = true;
      this.dynamicOrderList = response.data.dynamicDetailsDao;
      this.saleOrderObj.flags.isLoading = false;
      this.totalValue = response.data.totalPrice
      if (response.data.code != 200) {
        let message = AppConstants.translate(response.data.message)
        this.openSnackBar(message, '');
      }

    })

  }


  findCustomerByName() {
    //check items
    this.saleOrderObj.flags.isLoading = true;
    this.customerService.findByName(this.searchCustomerInout).subscribe(
      () => {
        this.saleOrderObj.flags.isLoading = false;
      },
      (error: any) => console.log(error)
    );
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchCustomerInout = SelectedHuman;
    this.findCustomerByName();
  }

  displayFn(value: any): string {
    this.searchCustomerInout = value;
    return value;
  }

  onSaveOrder() {
    this.saveOrder()
  }

  saveOrder() {
    if (this.saleOrderObj.flags.canCustomer == true && this.searchCustomerInout == '') {
      this.openSnackBar('اختر العميل', '');
    } else  {
      let saveOrderRequest: SaveOrderRequest = {
        customerName: this.searchCustomerInout,
        discountAmount: this.discount,
        dynamicDetailsList: this.dynamicOrderList,
        orderCode: this.saleOrderObj.orderCode,
        orderType: this.saleOrderObj.orderType,
        paidAmount: this.paid,
        paymentType: this.saleOrderObj.paymentType,
        total: this.totalValue
      }
      this.saleOrderObj.flags.isLoading = true
      this.orderService.createOrder(saveOrderRequest).subscribe(() => {
        this.saleOrderObj.flags.isLoading = false
        this.openSnackBar(this.arabic.util.saved, '')
        this.reset();
      },(err: HttpErrorResponse) =>{
        this.saleOrderObj.flags.isLoading = false
        this.openSnackBar(err.error.message, '')
         this.saleOrderObj.flags.isLoading = false
      });
    }
  }

  isOrderValid(): boolean {
    if (this.saleOrderObj.flags.canCustomer == true && this.searchCustomerInout == '')
      return false
    if (this.dynamicOrderList.length > 0)
      return true;
    else
      return false;
  }

  onSaveAndPrint() {
  
    let dataServer = {
      orderCode: this.saleOrderObj.orderCode,
    };

    if (this.saleOrderObj.flags.canCustomer == true && this.searchCustomerInout == '') {
      this.openSnackBar('اختر العميل', '');
    } else  {
      let saveOrderRequest: SaveOrderRequest = {
        customerName: this.searchCustomerInout,
        discountAmount: this.discount,
        dynamicDetailsList: this.dynamicOrderList,
        orderCode: this.saleOrderObj.orderCode,
        orderType: this.saleOrderObj.orderType,
        paidAmount: this.paid,
        paymentType: this.saleOrderObj.paymentType,
        total: this.totalValue
      }
      this.saleOrderObj.flags.isLoading = true
      this.orderService.createOrder(saveOrderRequest).subscribe(data => {
        this.saleOrderObj.flags.isLoading = false
        this.openSnackBar(this.arabic.util.saved, '')
        this.reset();

        this.dataServer.changeMessage(dataServer);
        this.redirectTo(`/printing/sale-order-invoice`);

      },
      (err: HttpErrorResponse) =>{
        this.saleOrderObj.flags.isLoading = false
        this.openSnackBar(err.error.message, '')
         this.saleOrderObj.flags.isLoading = false
      });
    }

   
  }

  reset() {
    this.totalValue = 0;
    this.paid = 0;
    this.discount = 0;
    this.dynamicOrderList = [];
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
        (data: any) => {
          this.openSnackBar(`${this.arabic.util.saved}`, '');
          this.getAllNames();
        },
        (error: any) => console.log(data)
      );
    });
  }

  onPaymentTypeChange(value: string) {
    console.log(value);

    this.var_arabic.orderType = AppConstants.translate(this.saleOrderObj.orderType);
    this.var_arabic.paymentType = AppConstants.translate(this.saleOrderObj.paymentType);

    if (value == PaymentTypeRequest.INSTALLMENT) {
      this.saleOrderObj.flags.isInstallment = true;
      this.saleOrderObj.flags.canCustomer = true;
    } else if (value == PaymentTypeRequest.CASH) {
      this.saleOrderObj.flags.canCustomer = false;
      this.saleOrderObj.flags.isInstallment = false;
    } else {
      this.saleOrderObj.flags.isInstallment = false;
      this.saleOrderObj.flags.canCustomer = true;
    }
    this.saleOrderObj.flags.IspaymentType = false;
  }

  onorderTypeChange(value: string) {
    console.log(value);
    this.var_arabic.orderType = AppConstants.translate(this.saleOrderObj.orderType);
    this.var_arabic.paymentType = AppConstants.translate(this.saleOrderObj.paymentType);
    this.saleOrderObj.flags.IsorderType = false;
  }

  deleteDynamicItem(obj: any) {
    for (var i = 0; i < this.dynamicOrderList.length; i++) {
      if (this.dynamicOrderList[i] === obj) {
        this.dynamicOrderList.splice(i, 1);
      }
    }
    this.calcTotal();
  }

  openUpdateQuantity(content: any, obj: DynamicDetailsDao) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalquantity = obj.quantity;
    this.dynamcObjectSelected = obj;
    this.deleteDynamicItem(obj)
  }

  onupdateQuantity() {
    this.findDynamicPyCode(this.saleOrderObj.paymentType,
      this.saleOrderObj.orderType,
      this.dynamcObjectSelected.productCode,
      this.modalquantity);
    this.modalService.dismissAll();
  }

  /**
   * uiux
   */

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['navy']
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
    this.producForm = this.fb.group({
      productValueControl: new FormControl({
        value: '',
        disabled: this.canOrder,
      }),
      productFilter: [null, [Validators.required]],
    });

    this.quantityValidateForm = this.fb.group({
      modalquantity: [this.modalquantity, [Validators.required]],
    });
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
