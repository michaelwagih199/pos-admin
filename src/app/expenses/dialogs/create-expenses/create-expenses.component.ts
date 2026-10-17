import { Component, OnInit, inject } from '@angular/core';
import { ExpensessModel } from '../../models/expensess-model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateProductComponent } from 'src/app/stock/dialog/create-product/create-product.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/stock/model/categoryModel';
import { ExpensesCategoryService } from '../../service/expenses-category.service';
import { Arabic } from 'src/app/text';
import { MatDivider } from '@angular/material/divider';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatInput, MatSuffix } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-expenses',
    templateUrl: './create-expenses.component.html',
    styleUrls: ['./create-expenses.component.scss'],
    imports: [MatDialogTitle, MatDivider, CdkScrollable, MatDialogContent, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatSelect, MatOption, MatDialogActions, MatButton]
})
export class CreateExpensesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(ExpensesCategoryService);
  private dialogRef = inject<MatDialogRef<CreateProductComponent>>(MatDialogRef);


  expenses: ExpensessModel = new ExpensessModel()
  validateForm!: FormGroup;
  categoryList!: CategoryModel[];
  arabic: Arabic = new Arabic()
  categoryId!: number

  dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    this.expenses = this.dialogData.model
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      expensesName: [null, [Validators.required]],
      expensesValue: [null, [Validators.required]],
      expensesDate: [null, [Validators.required]],
      notes: [null, ],
      productCategory: [null, [Validators.required]],
    });
    this.retrieveCategory()
  }

  /**
   * events
   */

  save() {
    let data = {
      model: this.expenses,
      categoryId:this.categoryId
    }
    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close();
  }



  /**
   * data
   */

  retrieveCategory() {
    this.categoryService.findAll().subscribe(
      (data) => {
        this.categoryList = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }


}
