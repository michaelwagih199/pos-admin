import { Component, OnInit, inject } from '@angular/core';
import { Arabic } from 'src/app/text';
import { ProductModel } from '../../model/productModel';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { CategoryModel } from '../../model/categoryModel';
import { CategoryServiceService } from '../../service/category-service.service';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss'],
    imports: [MatDialogTitle, MatDivider, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatCheckbox, MatFormField, MatLabel, MatInput, MatSelect, MatOption, MatDialogActions, MatButton]
})
export class CreateProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryServiceService);
  private dialogRef = inject<MatDialogRef<CreateProductComponent>>(MatDialogRef);

  arabic: Arabic = new Arabic()
  product: ProductModel = new ProductModel()
  validateForm!: FormGroup;
  codeDisabled: boolean = true;
  checkValue: any
  categoryList!: CategoryModel[];


  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
      console.log(this.dialogData);

    this.product = this.dialogData.productModel
  }

  ngOnInit(): void {
this.validateForm = this.fb.group({
  productCode: [null],
  productName: [null, [Validators.required]],
  wholesalePrice: [null, [Validators.required]],
  alertUnits: [null, [Validators.required]],
  measurementUnit: [null, [Validators.required]],
  numberUnitsInStock: [0, [Validators.required, Validators.min(0)]],
  numberOfCanvasesInStock: [0, [Validators.required, Validators.min(0)]],
  productCategory: [null, [Validators.required]]
});
    this.retrieveCategory();
  }

  save() {
   let data ={
      productModel:this.product,
      categoryId:this.checkValue
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }


  showOptions(event: MatCheckboxChange): void {
    console.log(event.checked);
    if (event.checked) {
      this.codeDisabled = false
      this.product.productCode = 'automatic'
    }
    else {
      this.codeDisabled = true
      this.product.productCode = ''
    }

  }

  retrieveCategory() {
    this.categoryService.findAll()
      .subscribe(
        data => {
          this.categoryList = data;
        },
        error => {
          console.log(error);
        });
  }

}
