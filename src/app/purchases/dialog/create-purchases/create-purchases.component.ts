import { Component, OnInit, Inject } from '@angular/core';
import { ExpensessModel } from 'src/app/expenses/models/expensess-model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { CategoryModel } from 'src/app/stock/model/categoryModel';
import { Arabic } from 'src/app/text';
import { ExpensesCategoryService } from 'src/app/expenses/service/expenses-category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductModel } from 'src/app/stock/model/productModel';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { PurchasesBillsService } from '../../service/purchases-bills.service';
import { PurchasesBillsDetails } from '../../model/purchases-deteails';
import { SupliersService } from 'src/app/suppliers/service/supliers.service';
import { Supplier } from 'src/app/suppliers/models/supplier';
import { PurchasesBills } from '../../model/purchases-bills';

@Component({
  selector: 'app-create-purchases',
  templateUrl: './create-purchases.component.html',
  styleUrls: ['./create-purchases.component.scss'],
})
export class CreatePurchasesComponent implements OnInit {
  validateForm!: FormGroup;
  validateDynamicForm!: FormGroup;

  arabic: Arabic = new Arabic();
  supliersList!: Supplier[];
  productList!: ProductModel[];
  product: ProductModel = new ProductModel();

  selectedSupllier!: Supplier;

  dynamicOrderList: PurchasesBillsDetails[] = [];
  obj: PurchasesBills = new PurchasesBills();
  total: number = 0;
  paid: number = 0;
  purchasingDetails: PurchasesBillsDetails = new PurchasesBillsDetails();
  myControl = new FormControl();
  billsCode: any;

  constructor(
    private fb: FormBuilder,
    private productService: ProductServiceService,
    private supliersService: SupliersService,
    private billsPurchasesService: PurchasesBillsService,
    private dialogRef: MatDialogRef<CreatePurchasesComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.obj = data.model;
  }

  ngOnInit(): void {
    this.validate();
    this.getProducts();
    this.getNextCode();
    this.getAllSuppliers();
  }

  /**
   * events
   */

  save() {
    this.obj.billCodeCode = this.billsCode;
    this.obj.paid = this.paid;
    this.obj.total = this.total;
    this.obj.remaining = this.total - this.paid;
    let data = {
      model: this.obj,
      supplier: this.selectedSupllier,
      dynamicOrderList: this.dynamicOrderList,
    };
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }

  deleteDynamicItem(obj: any) {
    for (var i = 0; i < this.dynamicOrderList.length; i++) {
      if (this.dynamicOrderList[i] === obj) {
        this.dynamicOrderList.splice(i, 1);
      }
    }
  }

  orderDetails() {}

  addDynamic() {
    this.total = 0
    this.purchasingDetails.product = this.product;
    this.purchasingDetails.total =
      this.purchasingDetails.itemPrice * this.purchasingDetails.itemQuantity;
    this.dynamicOrderList.push(this.purchasingDetails);

    this.dynamicOrderList.forEach((element) => {
      this.total += element.total;
    });
    this.purchasingDetails = new PurchasesBillsDetails();
  }

  /**
   * data
   */

  getProducts() {
    this.productService.findAll().subscribe((data) => {
      this.productList = data;
    });
  }

  getNextCode() {
    this.billsPurchasesService.getBillsCode().subscribe(
      (data) => {
        this.billsCode = data;
        this.obj.billCodeCode = data;
      },
      (error) => console.log(error)
    );
  }

  getAllSuppliers() {
    this.supliersService.findAll().subscribe(
      (data) => {
        this.supliersList = data;
      },
      (error) => console.error(error)
    );
  }

  // uiux

  validate() {
    this.validateForm = this.fb.group({
      billsDate: [null, [Validators.required]],
      supplierName: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      notes: [null],
    });

    this.validateDynamicForm = this.fb.group({
      product: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
  }
}
