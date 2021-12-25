import { Component, OnInit, Inject } from '@angular/core';
import { Arabic } from 'src/app/text';
import { ProductModel } from '../../model/productModel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CategoryModel } from '../../model/categoryModel';
import { CategoryServiceService } from '../../service/category-service.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  arabic: Arabic = new Arabic()
  product: ProductModel = new ProductModel()
  validateForm!: FormGroup;
  codeDisabled: boolean = true;
  checkValue: any
  categoryList!: CategoryModel[];


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryServiceService,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.product = data.productModel
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      productCode: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      purchasingPrice: [null, [Validators.required]],
      retailPrice: [null, [Validators.required]],
      wholesalePrice: [null, [Validators.required]],
      numberUnitsInStock: [null, [Validators.required]],
      alertUnits: [null, [Validators.required]],
      productCategory: [null, [Validators.required]],
    });
    this.retrieveCategory()
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
      // this.codeDisabled = false
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
