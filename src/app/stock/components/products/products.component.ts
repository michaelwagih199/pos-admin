import { Component, OnInit } from '@angular/core';
import { Arabic } from 'src/app/text';
import { CategoryModel } from '../../model/categoryModel';
import { ProductModel } from '../../model/productModel';
import { CategoryServiceService } from '../../service/category-service.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductServiceService } from '../../service/product-service.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { CreateProductComponent } from '../../dialog/create-product/create-product.component';
import { BarcodeComponent } from '../../dialog/barcode/barcode.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  arabic: Arabic = new Arabic();
  categoryList!: CategoryModel[];
  productList!: ProductModel[];
  product: ProductModel = new ProductModel();
  searchInout: any;
  selectedSearchFilter!: string;
  isLoading: boolean = false;

  //for tables
  displayedColumns: string[] = [
    'id',
    'productName',
    'retailPrice',
    'purchasingPrice',
    'numberUnitsInStock',
    'alertUnits',
    'productCategory',
    'wholesalePrice',
    'expirationDate',
    'actions',
  ];
  myControl = new FormControl();
  //for autocomplete
  options!: string[];
  filteredOptions!: Observable<string[]>;

  constructor(
    private categoryService: CategoryServiceService,
    private productService: ProductServiceService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProductNames();
    this.retrieveProductsPagable();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  /**
   * data
   */

  getProductNames() {
    this.productService.getNames().subscribe(
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

  findProductByName() {
    this.isLoading = true;
    this.productService.findByName(this.searchInout).subscribe(
      (data) => {
        this.isLoading = false;
        this.productList = data;
      },
      (error) => console.log(error)
    );
  }

  findProductByCode() {
    this.isLoading = true;
    this.productService.findByCode(this.searchInout).subscribe(
      (data) => {
        this.isLoading = false;
        this.productList = data;
      },
      (error) => console.log(error)
    );
  }

  refresh() {
    this.retrieveProductsPagable();
    this.searchInout = '';
  }

  retrieveProductsPagable() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.productService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.productList = data.products;
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

  search() {
    if (this.selectedSearchFilter == 'name') this.findProductByName();
    else if (this.selectedSearchFilter == 'code') this.findProductByCode();
  }

  displayFn(value: any): string {
    this.searchInout = value;
    return value;
  }

  onBarcode(element: any) {
    console.log(element);

    // this.isLoading = true;
    const dialogRef = this.dialog.open(BarcodeComponent, {
      data: {
        productCode: element,
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchInout = SelectedHuman;
    this.findProductByName();
  }

  deleteDialog(action: any, obj: any) {
    this.isLoading = true;
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.productName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = false;
        this.productService.delete(obj.id).subscribe(
          (data) => {
            this.openSnackBar(
              `${this.arabic.stock.category.util.dialog.notification.deleted}`,
              ''
            );
            this.retrieveProductsPagable();
            this.getProductNames();
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
      productModel: obj,
      categoryId: 0,
    };
    this.dialog.open(CreateProductComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateProductComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      this.productService
        .update(data.productModel.id, data.productModel, data.categoryId)
        .subscribe(
          (data) => {
            this.openSnackBar(`${this.arabic.util.saved}`, '');
            this.refresh();
          },
          (error) => console.log(data)
        );
    });
  }

  onSearchFilterChange(value: string) {
    if (value == 'name') {
      this.getProductNames();
      this.searchInout = '';
    } else {
      this.searchInout = '';
      this.options = [];
    }
    console.log(value);
  }

  addProductDialog() {
    this.product = new ProductModel();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      productModel: this.product,
      categoryId: 0,
    };
    this.dialog.open(CreateProductComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateProductComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      this.productService.create(data.productModel, data.categoryId).subscribe(
        (data) => {
          this.openSnackBar(`${this.arabic.util.saved}`, '');
          this.refresh();
          this.dialog.closeAll();
        },
        (error) =>{
          if (error.error.message === 'Product Saved In System') {
            this.openSnackBar(`${this.arabic.error['Product Saved In System']}`, '');
           this.dialog.closeAll();
          }
        }
      );
    });
  }

  /**
   * UIUX and Helbers
   *
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
    this.retrieveProductsPagable();
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
