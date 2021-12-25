import { Component, OnInit } from '@angular/core';
import { ExpensesCategoryService } from '../../service/expenses-category.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpensessModel } from '../../models/expensess-model';
import { ExpensesService } from '../../service/expenses.service';
import { element } from 'protractor';
import { Arabic } from 'src/app/text';
import { CreateExpensesComponent } from '../../dialogs/create-expenses/create-expenses.component';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
})
export class ExpensesListComponent implements OnInit {
  arabic: Arabic = new Arabic();

  isLoading: boolean = false;
  selectedValue: string | undefined;
  total: number = 0.0;
  categoryList = [];
  expensesList!: ExpensessModel[];
  expenses: ExpensessModel = new ExpensessModel();

  displayedColumns: string[] = [
    'id',
    'createdDate',
    'expensesName',
    'expensesValue',
    'notes',
    'expensesCategory',
    'actions',
  ];

  constructor(
    private categoryService: ExpensesCategoryService,
    private expensesService: ExpensesService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllNames();
    this.retrieve();
  }

  /**
   * data
   */
  getAllNames() {
    this.categoryService.getNames().subscribe(
      (response) => {
        this.categoryList = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  retrieve() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.expensesService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.expensesList = data.expenses;
        (this.count = data.totalItems), this.sumTotal();
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  sumTotal() {
    this.total = 0;
    this.expensesService.findAll().subscribe(
      (data) => {
        let list: ExpensessModel[];
        list = data;
        list.forEach((element) => {
          this.total += element.expensesValue;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * events
   */

  refresh() {}

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      model: this.expenses,
    };

    this.dialog.open(CreateExpensesComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateExpensesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      this.addExpenses(data.model, data.categoryId);
      this.getAllNames();
    });
  }

  addExpenses(expenses: any, categoryId: any) {
    this.expensesService.create(expenses, categoryId).subscribe((data) => {
      this.openSnackBar(`${this.arabic.util.saved}`, '');
      this.retrieve();
    });
  }

  editeDialog(obj: ExpensessModel) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      model: obj,
    };
    this.dialog.open(CreateExpensesComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateExpensesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      this.expensesService
        .update(data.model.id, data.model)
        .subscribe((data) => {
          this.openSnackBar(`${this.arabic.util.saved}`, '');
          this.retrieve();
        });
    });
  }

  deleteDialog(obj: ExpensessModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.expensesName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.expensesService.delete(obj.id).subscribe(
          (data) => {
            this.openSnackBar(
              `${this.arabic.stock.category.util.dialog.notification.deleted}`,
              ''
            );
            this.retrieve();
            this.getAllNames();
          },
          (error) => console.log(error)
        );
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  /**
   * ui ux
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  page = 1;
  count = 0;
  pageSize = 6;

  handlePageChange(event: any) {
    this.page = event;
    this.retrieve();
  }

  getRequestParams(page: any, pageSize: any) {
    // tslint:disable-next-line:prefer-const
    let params: any = {};
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }
}
