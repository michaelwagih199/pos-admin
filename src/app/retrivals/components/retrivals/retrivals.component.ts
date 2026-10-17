import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { Arabic } from 'src/app/text';
import { RerivalDetailsComponent } from '../../dialgos/rerival-details/rerival-details.component';
import { RetrivalsModel } from '../../models/retrivals-model';
import { RetrivalsDetailsService } from '../../service/retrivals-details.service';
import { RetrivalsService } from '../../service/retrivals.service';

@Component({
    selector: 'app-retrivals',
    templateUrl: './retrivals.component.html',
    styleUrls: ['./retrivals.component.scss'],
    standalone: false
})
export class RetrivalsComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'retrievalsCode',
    'totalCost',
    'discount',
    'netCost',
    'person',          // ← changed
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
    private router: Router,
    private dialog: MatDialog) { }

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
  editeDialog(obj: any) { }

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
    this.dialog.open(RerivalDetailsComponent, {
      data: { id: obj.id },
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


  addDialog() {
    this.router.navigate(['/retrivals/new']);
  }
}
