import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpensessModel } from 'src/app/expenses/models/expensess-model';
import { ExpensesCategoryService } from 'src/app/expenses/service/expenses-category.service';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { OrderPaymentModel } from 'src/app/sale-orders/models/orderPayment';
import { SaleOrderModel } from 'src/app/sale-orders/models/saleOrder';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { OrderPaymentService } from 'src/app/sale-orders/service/order-payment.service';
import { OrderService } from 'src/app/sale-orders/service/order.service';
import { CreateProductComponent } from 'src/app/stock/dialog/create-product/create-product.component';
import { RetrivalsModel } from '../../models/retrivals-model';
import { RetrivalsService } from '../../service/retrivals.service';

@Component({
  selector: 'app-create-retrivals',
  templateUrl: './create-retrivals.component.html',
  styleUrls: ['./create-retrivals.component.scss'],
})
export class CreateRetrivalsComponent implements OnInit {
  validateForm!: FormGroup;
  retriveModel: RetrivalsModel = new RetrivalsModel();
  codeSearch: any;
  billsCode: any;
  saleOrderList: SaleOrderDetails[] | undefined;
  retrivalBillsList: SaleOrderDetails[] = [];
  saleOrderPaymentList: OrderPaymentModel[] | undefined;
  quantity: number = 0;
  maxQuantity: number = 0;
  discount:number = 0;
  total:number = 0;
  netCost:number = 0;

  ismaxQuantity: boolean = false;
  productSelected: SaleOrderDetails = new SaleOrderDetails();

  constructor(
    private fb: FormBuilder,
    private retrivalService: RetrivalsService,
    private orderPaymentService: OrderPaymentService,
    private modalService: NgbModal,
    private saleOrderDetails: OrderDetailsService,
    private dialogRef: MatDialogRef<CreateRetrivalsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {}

  ngOnInit(): void {
    this.getNextCode();
    this.validateForm = this.fb.group({
      description: [this.quantity, [Validators.required]],
    });
  }

  /**
   * data
   */
  getNextCode() {
    this.retrivalService.getBillsCode().subscribe((data) => {
      this.billsCode = data;
    });
  }

  /**
   * events
   */

  save() {
    if (this.retrivalBillsList.length!=0) {
      this.retriveModel.discount = this.discount
      this.retriveModel.totalCost = this.total
      this.retriveModel.netCost = this.total - this.discount
      
      let data = {
        model: this.retriveModel,
        billsCode: this.billsCode,
        dynamicList:this.retrivalBillsList,
        codeSearch:this.codeSearch
      };
      this.dialogRef.close(data);
    } else {
      console.log("error");
      
    }
  }

  deleteDynamicItem(obj: any) {
    for (var i = 0; i < this.retrivalBillsList.length; i++) {
      if (this.retrivalBillsList[i] === obj) {
        this.retrivalBillsList.splice(i, 1);
      }
    }
    // this.calcTotal()
  }

  open(content: any, item: SaleOrderDetails) {
    this.maxQuantity = item.quantity;
    this.productSelected = item;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onAddRetrival() {
    if (this.maxQuantity < this.quantity || this.quantity == 0) {
      this.ismaxQuantity = true;
    } else {
      let dynamic: SaleOrderDetails = new SaleOrderDetails();
      dynamic.price = this.productSelected.price;
      dynamic.quantity = this.quantity;
      dynamic.total = this.quantity * this.productSelected.price;
      dynamic.product = this.productSelected.product;
      this.retrivalBillsList.push(dynamic);
      this.calcTotal();
      this.modalService.dismissAll();
    }
  }

  onRetrive(obj: SaleOrderDetails) {
    console.log(obj);
  }

  getBills() {
    this.clear()
    this.saleOrderDetails.getByCode(this.codeSearch).subscribe((data) => {
      this.saleOrderList = data;
    });
    this.orderPaymentService.getByCode(this.codeSearch).subscribe((data) => {
      this.saleOrderPaymentList = data;
    });
  }

  clear() {
    this.retriveModel = new RetrivalsModel();
    this.saleOrderList = [];
    this.retrivalBillsList = [];
    this.saleOrderPaymentList = [];
    this.quantity = 0;
    this.maxQuantity = 0;
    this.ismaxQuantity = false;
    this.productSelected = new SaleOrderDetails();
  }

  close() {
    this.dialogRef.close();
  }

  calcTotal() {
    this.discount = 0;
    this.total = 0
    if (this.retrivalBillsList.length == 0) {
      this.total = 0
    } else {
      this.total = this.retrivalBillsList.map(a => a.total).reduce(function (a, b) {
        return a + b;
      })
    }
  }
}
