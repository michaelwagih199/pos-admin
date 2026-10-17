import { Component, OnInit, Inject } from '@angular/core';
import { ExpensessModel } from '../../models/expensess-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProductComponent } from 'src/app/stock/dialog/create-product/create-product.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/stock/model/categoryModel';
import { ExpensesCategoryService } from '../../service/expenses-category.service';
import { Arabic } from 'src/app/text';

@Component({
  selector: 'app-create-expenses',
  templateUrl: './create-expenses.component.html',
  styleUrls: ['./create-expenses.component.scss']
})
export class CreateExpensesComponent implements OnInit {

  expenses: ExpensessModel = new ExpensessModel()
  validateForm!: FormGroup;
  categoryList!: CategoryModel[];
  arabic: Arabic = new Arabic()
  categoryId!: number

  constructor(
    private fb: FormBuilder,
    private categoryService: ExpensesCategoryService,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.expenses = data.model
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
