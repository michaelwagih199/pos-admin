import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RetrivalsModel } from '../../models/retrivals-model';
import { RetrivalsService } from '../../service/retrivals.service';
import { RerivalDetailsComponent } from '../../dialgos/rerival-details/rerival-details.component';
import { CreateRetrivalsComponent } from '../../dialgos/create-retrivals/create-retrivals.component';
import { Arabic } from 'src/app/text';
import { RetrivalsDetailsModel } from '../../models/retrivals-details-model';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { RetrivalsDetailsService } from '../../service/retrivals-details.service';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-retrivals',
  templateUrl: './retrivals.component.html',
  styleUrls: ['./retrivals.component.scss'],
})
export class RetrivalsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'retrievalsCode',
    'totalCost',
    'discount',
    'netCost',
    'customer',
    'createdDate',
    'actions',
  ];

  arabic: Arabic = new Arabic();
  retrivalsList!: RetrivalsModel[];
  retriveModel: RetrivalsModel = new RetrivalsModel();
  isLoading = false;

  constructor(
    private _snackBar: MatSnackBar,
    private retrivalService: RetrivalsService,
    private retrivalDetailsService: RetrivalsDetailsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.retrieve();
  }

  /**
   * data
   */

  retrieve() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.retrivalService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.retrivalsList = data.retrievalsBills;
        this.count = data.totalItems;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * evants
   */
  editeDialog(obj: any) {}
  
  deleteDialog(obj: RetrivalsModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.retrievalsCode}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.retrivalService.delete(obj.id).subscribe(data => {
          this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.deleted}`, '')
          this.retrieve()
        }, error => console.log(error))
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
    this.dialog.open(RerivalDetailsComponent, dialogConfig);
    const dialogRef = this.dialog.open(RerivalDetailsComponent, dialogConfig);
  }

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      retriveModel: this.retriveModel,
    };

    this.dialog.open(CreateRetrivalsComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateRetrivalsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      let retrivalDetails: RetrivalsDetailsModel = new RetrivalsDetailsModel();
      let dynamicList: SaleOrderDetails[] = data.dynamicList;
      let billsCode = data.billsCode
      //insert retrival
      this.retrivalService.create(data.model, data.codeSearch).subscribe(
        (data) => {
          //insert retrival details
          dynamicList.forEach((element) => {
            console.log(element);
            
            retrivalDetails.price = element.price;
            retrivalDetails.quantity = element.quantity;
            retrivalDetails.total = element.total;
            //create details
            console.log(billsCode);
            
            this.retrivalDetailsService
              .create(retrivalDetails, billsCode, element.product.productCode)
              .subscribe((data) => {
                this.openSnackBar(`${this.arabic.util.saved}`, '');
                this.retrieve();
              });
          });
        },
        (error) => {
          console.log(error);
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
