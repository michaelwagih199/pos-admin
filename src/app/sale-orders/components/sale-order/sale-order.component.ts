import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CreateCustomerComponent } from 'src/app/customers/dialogs/create-customer/create-customer.component';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { DynamicSOrderType } from 'src/app/reports/models/dynamic-sale-order-type';
import { DataService } from 'src/app/shared/service/data.service';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';
import { Arabic } from 'src/app/text';
import { AppConstants } from '../../../_helpers/constants';
import { DynamicOrdersComponent } from '../../../reports/components/dialog/dynamic-orders/dynamic-orders.component';
import { CheckitesResponse } from '../../models/checkitems';
import {
  DynamicDetailsDao,
  DynamicOrderByCodeRequest,
  DynamicOrderByNameRequest,
} from '../../models/dynamic-order-request';
import { OrderDetailsPayload } from '../../models/orderPayload';
import { OrderPaymentModel } from '../../models/orderPayment';
import { PaymentTypeRequest } from '../../models/ordersrequest';
import { SaveOrderRequest } from '../../models/save-order-request';
import { DynamicItemService } from '../../service/dynamic-item.service';
import { OrderService } from '../../service/order.service';

@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss'],
})

export class SaleOrderComponent implements OnInit {
  quantityValidateForm!: FormGroup;
  arabic: Arabic = new Arabic();
  currentDate = new Date();
  myControl = new FormControl('');
  productControl = new FormControl('');
  customer: CustomerModel = new CustomerModel();
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
  productOptions: string[] = [];
  productFilteredOptions!: Observable<string[]>;
  modalQuantity: number = 0;
  modalCanvasTopUnits: number = 0;

  saleOrderObj = {
    orderCode: '',
    paymentType: '',
    searchType: '',
    flags: {
      isLoading: false,
    },
    dataLake: {
      paymentType: [
        { key: this.arabic.saleOrder.util.paymentTypeSelection.cash, value: PaymentTypeRequest.CASH },
        { key: this.arabic.saleOrder.util.paymentTypeSelection.oncredit, value: PaymentTypeRequest.CREDIT },
      ],
    },
  };

  var_arabic = {
    paymentType: '',
  };

  searchCustomerInout = '';
  productSearchValue = '';
  productSelectedSearchFilter = 'code';

  dynamicOrderList: DynamicDetailsDao[] = [];
  dynamcObjectSelected: DynamicDetailsDao = new DynamicDetailsDao();

  totalValue = 0;
  paid = 0;
  discount = 0;


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
    private dataServer: DataService
  ) { }

  ngOnInit(): void {
    this.getAllNames();
    this.getOrderCode();
    this.getProductNames();
    this.validateForm();
  }

  // ----- Data Fetching -----
  getAllNames() {
    this.customerService.getNames().subscribe(
      (response: string[]) => {
        this.options = response || [];
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
      },
      (error) => console.error('Error fetching customer names', error)
    );
  }

  getOrderCode() {
    this.saleOrderObj.flags.isLoading = true;
    this.orderService.getOrderCode().subscribe(
      (data: any) => {
        this.saleOrderObj.flags.isLoading = false;
        this.saleOrderObj.orderCode = data || '';
      },
      (error) => {
        this.saleOrderObj.flags.isLoading = false;
        console.error('Error fetching order code', error);
      }
    );
  }

  getProductNames() {
    this.productService.getNames().subscribe(
      (response: string[]) => {
        this.productOptions = response || [];
        this.productFilteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterproduct(value || ''))
        );
      },
      (error) => console.error('Error fetching product names', error)
    );
  }

  getProductCodes() {
    this.productService.getCodes().subscribe(
      (response: string[]) => {
        this.productOptions = response || [];
        this.productFilteredOptions = this.productControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filterproduct(value || ''))
        );
      },
      (error) => console.error('Error fetching product codes', error)
    );
  }

  // ----- Event Handlers -----
  search() {
    this.findCustomerByName();
  }

  onSearchFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'name') {
      this.getProductNames();
      this.productSearchValue = '';
      this.saleOrderObj.searchType = AppConstants.SEARCH_BY_NAME;
    } else {
      this.getProductCodes();
      this.productSearchValue = '';
      this.saleOrderObj.searchType = AppConstants.SEARCH_BY_CODE;
    }
  }

  OnProductSelected(selected: string) {
    this.productSearch(selected);
  }

  onProductEnter(selected: string) {
    this.productSearch(selected);
  }

  viewOrderToday(): void {
    this.dialog.open(DynamicOrdersComponent, {
      width: '80%',
      height: '80%',
      data: { orderType: DynamicSOrderType.TODAY_ORDERS },
    });
  }

  productSearch(searchKey: string) {
    if (!searchKey || searchKey.trim() === '') {
      this.openSnackBar('يرجى إدخال اسم أو كود المنتج', '');
      return;
    }

    const canvasTopUnits = this.producForm?.get('quantityControl')?.value ?? 1;
    if (canvasTopUnits <= 0) {
      this.openSnackBar('يرجى إدخال كمية صحيحة (متر/كجم)', '');
      return;
    }

    const pieceQuantity = this.producForm?.get('pieceQuantityControl')?.value ?? 1;
    if (pieceQuantity <= 0) {
      this.openSnackBar('يرجى إدخال عدد صحيح للاتواب', '');
      return;
    }
this.producForm.get('quantityControl')?.setValue(1);
this.producForm.get('pieceQuantityControl')?.setValue(1);
    const searchBy = this.saleOrderObj.searchType === AppConstants.SEARCH_BY_CODE ? 'CODE' : 'NAME';

    if (this.saleOrderObj.searchType === AppConstants.SEARCH_BY_CODE) {
      this.findDynamicByCode(searchKey.trim(), canvasTopUnits, searchBy, pieceQuantity);
    } else {
      this.findDynamicByName(searchKey.trim(), canvasTopUnits, searchBy, pieceQuantity);
    }
  }

  findDynamicByCode(productCode: string, canvasTopUnits: number, searchBy: string, quantity: number = 1) {
    const request: DynamicOrderByCodeRequest = {
      dynamicDetailsDao: this.dynamicOrderList,
      quantity: quantity,
      productCode: productCode,
      canvasTopUnits: canvasTopUnits,
      searchBy: searchBy,
    };

    this.saleOrderObj.flags.isLoading = true;
    this.dynamicItemService.findDynamicProductByCode(request).subscribe(
      (response) => {
        this.saleOrderObj.flags.isLoading = false;
        if (response?.data) {
          this.dynamicOrderList = response.data.dynamicDetailsDao || [];
          this.totalValue = response.data.totalPrice || 0;

          // FIX: Show message even if code is 200 (for soft alerts)
          if (response.data.message && response.data.message !== 'Can Order Product') {
            const message = AppConstants.translate(response.data.message) || response.data.message;
            this.openSnackBar(message, '');
          }
        }
      },
      (error) => {
        this.saleOrderObj.flags.isLoading = false;
        console.error('Error in findDynamicByCode', error);
        this.openSnackBar('حدث خطأ أثناء البحث عن المنتج', '');
      }
    );
  }

  findDynamicByName(productName: string, canvasTopUnits: number, searchBy: string, quantity: number = 1) {
    const request: DynamicOrderByNameRequest = {
      dynamicDetailsDao: this.dynamicOrderList,
      quantity: quantity,
      productName: productName,
      canvasTopUnits: canvasTopUnits,
      searchBy: searchBy,
    };
    this.saleOrderObj.flags.isLoading = true;
    this.dynamicItemService.findDynamicByName(request).subscribe(
      (response) => {
        this.saleOrderObj.flags.isLoading = false;
        if (response?.data) {
          this.dynamicOrderList = response.data.dynamicDetailsDao || [];
          this.totalValue = response.data.totalPrice || 0;
          if (response.data.code && response.data.code !== 200) {
            const message = AppConstants.translate(response.data.message) || response.data.message;
            this.openSnackBar(message, '');
          }
        }
      },
      (error) => {
        this.saleOrderObj.flags.isLoading = false;
        console.error('Error in findDynamicByName', error);
        this.openSnackBar('حدث خطأ أثناء البحث عن المنتج', '');
      }
    );
  }

  findCustomerByName() {
    const name = this.searchCustomerInout?.trim();
    if (!name) return;
    this.saleOrderObj.flags.isLoading = true;
    this.customerService.findByName(name).subscribe(
      () => {
        this.saleOrderObj.flags.isLoading = false;
      },
      (error) => {
        this.saleOrderObj.flags.isLoading = false;
        console.error('Error finding customer', error);
      }
    );
  }

  OnHumanSelected(selected: string) {
    this.searchCustomerInout = selected;
    this.findCustomerByName();
  }

  displayFn(value: any): string {
    return value || '';
  }

  // ----- Save Order -----
  onSaveOrder() {
    this.saveOrder(false);
  }

  onSaveAndPrint() {
    this.saveOrder(true);
  }


  clearProductSearch(): void {
    this.productControl.setValue('');
    this.productSearchValue = '';
  }

isOrderValid(): boolean {
  const hasProducts = this.dynamicOrderList.length > 0;
  const hasPaymentType = !!this.saleOrderObj.paymentType;
  const hasCustomer = this.searchCustomerInout?.trim() !== '';
  return hasProducts && hasPaymentType && hasCustomer;
}

  private saveOrder(print: boolean) {
    if (!this.searchCustomerInout || this.searchCustomerInout.trim() === '') {
      this.openSnackBar('يجب اختيار العميل', '');
      return;
    }
    if (!this.dynamicOrderList || this.dynamicOrderList.length === 0) {
      this.openSnackBar('لا توجد منتجات في الفاتورة', '');
      return;
    }
    if (!this.saleOrderObj.paymentType) {
      this.openSnackBar('يجب اختيار طريقة الدفع', '');
      return;
    }

    const saveRequest: SaveOrderRequest = {
      customerName: this.searchCustomerInout.trim(),
      discountAmount: this.discount || 0,
      dynamicDetailsList: this.dynamicOrderList,
      orderCode: this.saleOrderObj.orderCode || '',
      orderType: 'RETAIL', // default since removed from UI
      paidAmount: this.paid || 0,
      paymentType: this.saleOrderObj.paymentType,
      total: this.totalValue || 0,
    };

    this.saleOrderObj.flags.isLoading = true;
    this.orderService.createOrder(saveRequest).subscribe(
      () => {
        this.saleOrderObj.flags.isLoading = false;
        this.openSnackBar(this.arabic.util.saved, '');
        if (print) {
          const dataServer = { orderCode: this.saleOrderObj.orderCode, excludeOrder: "Y" };
          this.dataServer.changeMessage(dataServer);
          this.redirectTo('/printing/sale-order-invoice');
        }
        this.reset();
      },
      (err: HttpErrorResponse) => {
        this.saleOrderObj.flags.isLoading = false;
        const errorMsg = err?.error?.message || 'حدث خطأ أثناء حفظ الفاتورة';
        this.openSnackBar(errorMsg, '');
      }
    );
  }

  reset() {
    this.totalValue = 0;
    this.paid = 0;
    this.discount = 0;
    this.dynamicOrderList = [];
    this.productSearchValue = '';
    this.searchCustomerInout = '';
    this.producForm?.get('quantityControl')?.setValue(1);
    this.producForm?.get('pieceQuantityControl')?.setValue(1);
    this.getOrderCode();
  }

  // ----- Customer Dialog -----
  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { model: this.customer };
    const dialogRef = this.dialog.open(CreateCustomerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (data?.customerModel) {
        this.customerService.create(data.customerModel).subscribe(
          () => {
            this.openSnackBar(`${this.arabic.util.saved}`, '');
            this.getAllNames();
          },
          (error) => console.error('Error creating customer', error)
        );
      }
    });
  }

  // ----- Payment Type Change -----
  onPaymentTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.var_arabic.paymentType = AppConstants.translate(value) || value;
    this.saleOrderObj.paymentType = value;

    // If CASH, set paid = total (and disable the field)
    if (value === 'CASH') {
      this.paid = this.totalValue;
    }
  }
  // ----- Dynamic List Management -----
  deleteDynamicItem(item: DynamicDetailsDao) {
    const index = this.dynamicOrderList.indexOf(item);
    if (index > -1) {
      this.dynamicOrderList.splice(index, 1);
      this.calcTotal();
    }
  }

  openUpdateQuantity(content: any, item: DynamicDetailsDao) {
    this.modalService.open(content);
    this.quantityValidateForm.get('modalCanvasTopUnits')?.setValue(item.unitNumber);
    this.quantityValidateForm.get('modalQuantity')?.setValue(item.quantity);
    this.dynamcObjectSelected = item;
    this.deleteDynamicItem(item);
  }

  onupdateQuantity() {
    // Read values directly from the form controls
    const canvasTopUnits = this.quantityValidateForm.get('modalCanvasTopUnits')?.value ?? 0;
    const quantity = this.quantityValidateForm.get('modalQuantity')?.value ?? 0;

    console.log(canvasTopUnits, quantity);

    if (this.dynamcObjectSelected && canvasTopUnits > 0 && quantity > 0) {
      const searchBy = this.saleOrderObj.searchType === AppConstants.SEARCH_BY_CODE ? 'CODE' : 'NAME';
      if (this.saleOrderObj.searchType === AppConstants.SEARCH_BY_CODE) {
        this.findDynamicByCode(
          this.dynamcObjectSelected.productCode,
          canvasTopUnits,
          searchBy,
          quantity
        );
      } else {
        this.findDynamicByName(
          this.dynamcObjectSelected.productName,
          canvasTopUnits,
          searchBy,
          quantity
        );
      }
    } else {
      this.openSnackBar('يرجى إدخال قيم صحيحة', '');
    }
    this.modalService.dismissAll();
  }

  // ----- Utilities -----
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  private _filterproduct(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productOptions.filter((option) => option.toLowerCase().includes(filterValue));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action || 'إغلاق', {
      duration: 3000,
      panelClass: ['navy'],
    });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
  }

  refresh() {
    this.redirectTo('/saleOrder');
  }

  // ----- Form Validation -----
  validateForm() {
    this.producForm = this.fb.group({
      productFilter: ['code', [Validators.required]],
      quantityControl: [1, [Validators.required, Validators.min(0.001)]],
      pieceQuantityControl: [1, [Validators.required, Validators.min(1)]],
    });

    this.quantityValidateForm = this.fb.group({
      modalQuantity: [1, [Validators.required, Validators.min(1)]],
      modalCanvasTopUnits: [1, [Validators.required, Validators.min(0.01)]],
    });
  }

  // ----- Calculations -----
  calcTotal() {
    if (!this.dynamicOrderList || this.dynamicOrderList.length === 0) {
      this.totalValue = 0;
    } else {
      this.totalValue = this.dynamicOrderList.reduce((sum, item) => sum + (item.total || 0), 0);
    }

    // If payment type is CASH, set paid = total automatically
    if (this.saleOrderObj.paymentType === 'CASH') {
      this.paid = this.totalValue;
    }
  }
}
