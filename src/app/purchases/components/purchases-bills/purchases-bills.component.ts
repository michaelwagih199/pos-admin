import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { Supplier } from 'src/app/suppliers/models/supplier';
import { SupliersService } from 'src/app/suppliers/service/supliers.service';
import { Arabic } from 'src/app/text';
import { CreatePurchasesComponent } from '../../dialog/create-purchases/create-purchases.component';
import { PurchasesBillsDetailsComponent } from '../../dialog/purchases-bills-details/purchases-bills-details.component';
import { PurchasesBills } from '../../model/purchases-bills';
import { PurchasesBillsDetails } from '../../model/purchases-deteails';
import { PurchasesBillsService } from '../../service/purchases-bills.service';
import { PurchasingBillsDetailsService } from '../../service/purchasing-bills-details.service';
import * as moment from 'moment';

export interface PurchaseModel {
  billsDate: string|null
  paid: number
  supplierId: number
  purchasesBillDetails: PurchasesBillDetail[]
}

export interface PurchasesBillDetail {
  itemQuantity: number
  itemPrice: number
  productId: number
}

@Component({
  selector: 'app-purchases-bills',
  templateUrl: './purchases-bills.component.html',
  styleUrls: ['./purchases-bills.component.scss'],
})
export class PurchasesBillsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'billsDate',
    'billCodeCode',
    'total',
    'paid',
    'remaining',
    'mySupplier',
    'notes',
    'actions',
  ];
  purchasesBillsList!: PurchasesBills[];
  purchasesBills: PurchasesBills = new PurchasesBills();
  isLoading: boolean = false;
  selectedSupllier: any;
  supliersList!: Supplier[];
  dynamic!: PurchasesBillsDetails[];
  arabic: Arabic = new Arabic()


  constructor(
    private _snackBar: MatSnackBar,
    private purchasesBillsService: PurchasesBillsService,
    private purchasingBillsDetailsService: PurchasingBillsDetailsService,
    private supliersService: SupliersService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.retrieve();
    this.getAllSuppliers();
  }

  /**
   * data
   */

  retrieve() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.purchasesBillsService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.purchasesBillsList = data.purchasesBills;
        this.count = data.totalItems;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
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

  /**
   * evants
   */
  editeDialog(obj: any) { }

  deleteDialog(obj: PurchasesBills) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.billCodeCode}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`,
        },
      },
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.purchasesBillsService.delete(obj.id).subscribe(
          (data) => {
            this.openSnackBar(
              `${this.arabic.stock.category.util.dialog.notification.deleted}`,
              ''
            );
            this.retrieve();
          },
          (error) => console.log(error)
        );
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  Ondetails(obj: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: obj.id,
    };

    this.dialog.open(PurchasesBillsDetailsComponent, dialogConfig);
    const dialogRef = this.dialog.open(
      PurchasesBillsDetailsComponent,
      dialogConfig
    );
  }

  refresh() {
    this.retrieve();
    this.getAllSuppliers();
  }

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      model: this.purchasesBills,
    };

    this.dialog.open(CreatePurchasesComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreatePurchasesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);
      this.dynamic = data.dynamicOrderList;
      let purchasesBillDetailList: PurchasesBillDetail[] = []
      this.dynamic.forEach(product => {
        purchasesBillDetailList.push(
          {
            itemPrice: product.itemPrice,
            itemQuantity: product.itemQuantity,
            productId: product.product.id
          }
        )
      })
      let purchasesBillsNew: PurchaseModel = {
        billsDate: moment(data.model.billsDate).format('yyyy-MM-dd HH:mm:ss'),
        paid: data.model.paid,
        purchasesBillDetails: purchasesBillDetailList,
        supplierId: data.supplier.id
      };
      this.purchasesBillsService.create(purchasesBillsNew).subscribe(
        (post) => {
          console.log(post);
          this.openSnackBar('تم الحفظ', '');
          this.retrieve();
        },
        (error) => {
          this.openSnackBar(error.error.message, '');
          this.dialog.closeAll();
        }
      );
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
