import { Component, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Arabic } from 'src/app/text';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { CategoryModel } from 'src/app/stock/model/categoryModel';
import { CategoryServiceService } from 'src/app/stock/service/category-service.service';
import { CreateCategoryComponent } from 'src/app/stock/dialog/create-category/create-category.component';
import { ExpensesCategoryService } from '../../service/expenses-category.service';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatInput, MatSuffix } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-expenses-category',
    templateUrl: './expenses-category.component.html',
    styleUrls: ['./expenses-category.component.scss'],
    imports: [MatCard, MatCardHeader, ReactiveFormsModule, FormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, MatIcon, MatSuffix, MatAutocomplete, MatOption, MatIconButton, MatMiniFabButton, MatCardContent, MatProgressBar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, NgxPaginationModule, AsyncPipe]
})
export class ExpensesCategoryComponent implements OnInit {
  private categoryService = inject(ExpensesCategoryService);
  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  arabic: Arabic = new Arabic();
  categoryList!: CategoryModel[];
  category: CategoryModel = new CategoryModel();
  searchInout: any;
  isLoading: boolean = false;
  //for tables
  displayedColumns: string[] = ['id', 'categoryName', 'actions'];
  myControl = new FormControl();
  //for autocomplete
  options!: string[];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.getAllNames();
    this.retrieve();
    this.myControl.valueChanges.subscribe((value) => {
      this.searchInout = value;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return (this.options || []).filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  /**
   * data
   */
  getAllNames() {
    this.categoryService.getNames().subscribe(
      (response) => {
        this.options = response;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  findByName() {
    this.isLoading = true;
    const term = this.searchInout ?? this.myControl.value ?? '';
    this.categoryService.findByName(term).subscribe(
      (data) => {
        this.categoryList = data;
        this.isLoading = false;
      },
      (error) => console.log(error)
    );
  }

  refresh() {
    this.retrieve();
    this.searchInout = '';
    this.myControl.setValue('', { emitEvent: false });
  }

  retrieve() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.categoryService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.categoryList = data.expensesCategories;
        this.count = data.totalItems;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * events
   */

  deleteDialog(action: any, obj: any) {
    console.log(obj, action);
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.categoryName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.categoryService.delete(obj.id).subscribe(
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

  editeDialog(action: any, obj: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: obj.id,
      description: obj.categoryName,
    };
    const dialogRef = this.dialog.open(CreateCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      this.category.categoryName = data.description;
      this.editeCategory(obj.id);
      this.getAllNames();
    });
  }

  editeCategory(id: number) {
    this.categoryService.update(id, this.category).subscribe((data) => {
      this.openSnackBar(
        `${this.arabic.stock.category.util.dialog.notification.saved}`,
        ''
      );
      this.retrieve();
    });
  }

  addCategoryDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: '',
      description: '',
    };
    const dialogRef = this.dialog.open(CreateCategoryComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return;
      this.category.categoryName = data.description;
      this.addCategory();
      this.getAllNames();
    });
  }

  addCategory() {
    this.categoryService.create(this.category).subscribe((data) => {
      this.openSnackBar(
        `${this.arabic.stock.category.util.dialog.notification.saved}`,
        ''
      );
      this.retrieve();
    });
  }

  search() {
    this.findByName();
  }

  displayFn(value: any): string {
    return value || '';
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchInout = SelectedHuman;
    this.myControl.setValue(SelectedHuman, { emitEvent: false });
    this.findByName();
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
