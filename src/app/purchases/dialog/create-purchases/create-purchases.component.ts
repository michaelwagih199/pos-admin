import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductModel } from 'src/app/stock/model/productModel';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';
import { Supplier } from 'src/app/suppliers/models/supplier';
import { SupliersService } from 'src/app/suppliers/service/supliers.service';
import { Arabic } from 'src/app/text';
import { PurchasesBills } from '../../model/purchases-bills';
import { PurchasesBillsDetails } from '../../model/purchases-deteails';
import { PurchasesBillsService } from '../../service/purchases-bills.service';

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
  purchasingDetails: PurchasesBillsDetails = new PurchasesBillsDetails();
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

  // ----- Events -----
  save() {
    this.obj.billCodeCode = this.billsCode;

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
    const index = this.dynamicOrderList.indexOf(obj);
    if (index > -1) {
      this.dynamicOrderList.splice(index, 1);
    }
  }

  addDynamic() {
    if (!this.product || !this.purchasingDetails.itemQuantity || !this.purchasingDetails.numberOfPieces) {
      return;
    }
    // Store product and pieces
    this.purchasingDetails.product = this.product;
    // (Optional) store price if needed internally
    this.purchasingDetails.itemPrice = this.product.purchasingPrice;
    // The total will be calculated in the template, but we can also compute here
    this.dynamicOrderList.push({ ...this.purchasingDetails });
    // Reset form
    this.purchasingDetails = new PurchasesBillsDetails();
    this.product = new ProductModel();
  }

  // ----- Utility -----
getTotalSum(): number {
    return this.dynamicOrderList.reduce((sum, item) => sum + (item.itemQuantity * item.itemPrice), 0);
}

  // ----- Data -----
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

  // ----- Validation -----
  validate() {
    this.validateForm = this.fb.group({
      billsDate: [null, [Validators.required]],
      supplierName: [null, [Validators.required]],
      notes: [null],
    });

    this.validateDynamicForm = this.fb.group({
      product: [null, [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0.01)]],
      numberOfPieces: [null, [Validators.required, Validators.min(1)]],
    });
  }
}
