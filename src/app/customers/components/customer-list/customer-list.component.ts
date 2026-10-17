import { Component, OnInit, inject } from '@angular/core';
import { Arabic } from 'src/app/text';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith, map } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer-model';
import { CreateCustomerComponent } from '../../dialogs/create-customer/create-customer.component';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
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
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
    imports: [MatCard, MatCardHeader, ReactiveFormsModule, FormsModule, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, MatIcon, MatSuffix, MatAutocomplete, MatOption, MatIconButton, MatMiniFabButton, MatCardContent, MatProgressBar, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, NgxPaginationModule, AsyncPipe]
})

export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);



  arabic: Arabic = new Arabic()
  customerList!: CustomerModel[];
  customer: CustomerModel = new CustomerModel()
  searchInout: any
  isLoading: boolean = false

  //for tables
  displayedColumns: string[] = ['id', 'customerName', 'customerPhone', 'notes', 'actions']
  myControl = new FormControl();
  //for autocomplete
  options!: string[]
  selectedCustomersFilter: any
  filteredOptions!: Observable<string[]>

  ngOnInit(): void {
    this.getAllNames()
    this.retrieve()
    this.myControl.valueChanges.subscribe(value => {
      this.searchInout = value;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return (this.options || []).filter(option => option.toLowerCase().includes(filterValue));
  }

  /**
     * data
     */
  getAllNames() {
    this.customerService.getNames().subscribe(response => {
      this.options = response
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }, error => {
      console.log(error)
    })
  }

  findByName() {
    this.isLoading = true
    const term = this.searchInout ?? this.myControl.value ?? ''
    this.customerService.findByName(term).subscribe(data => {
      this.customerList = data
      this.isLoading = false
    }, error => console.log(error))
  }

  refresh() {
    this.retrieve();
    this.searchInout = ''
    this.myControl.setValue('', { emitEvent: false })
  }


  retrieve() {
    this.isLoading = true
    const params = this.getRequestParams(this.page, this.pageSize);
    this.customerService.getAllPagination(params)
      .subscribe(
        data => {
          this.isLoading = false
          this.customerList = data.customers;
          this.count = data.totalItems;
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }

  getAllDebitCustomer() {
    this.isLoading = true;
    this.customerService.getAllDebitCustomer().subscribe(data => {
      this.isLoading = false
      this.customerList = data.data;
    }, error => {
      this.isLoading = false
      console.log(error);
    });
  }


  /**
   * events
   */

  deleteDialog(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.customerName}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.customerService.delete(obj.id).subscribe(data => {
          this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.deleted}`, '')
          this.retrieve()
          this.getAllNames()
        }, error => console.log(error))
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  onSearchFilterChange(value: string) {
    if (value == 'allCustomer') {
      this.retrieve();
    } else {
      this.getAllDebitCustomer()
    }

  }

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      model: this.customer,
    }

    this.dialog.open(CreateCustomerComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateCustomerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data)
        this.customerService.create(data.customerModel).subscribe(data => {
          this.openSnackBar(`${this.arabic.util.saved}`, '')
          this.refresh();
        }, error => console.log(data))

      }
    );
  }

  editeDialog(obj: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      model: obj,
    }
    this.dialog.open(CreateCustomerComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateCustomerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data)
        this.customerService.update(obj.id, data.customerModel).subscribe(data => {
          this.openSnackBar(`${this.arabic.util.saved}`, '')
          this.refresh();
        }, error => console.log(data))
      }
    );
  }






  addCategory() {
    this.customerService.create(this.customer).subscribe(data => {
      this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.saved}`, '')
      this.retrieve()
    })
  }

  onCustomerDetails(id: number) {
    this.router.navigate([`customers/customerDetails/${id}`])
  }

  search() {
    this.findByName()
  }

  displayFn(value: any): string {
    return value || '';
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchInout = SelectedHuman;
    this.myControl.setValue(SelectedHuman, { emitEvent: false });
    this.findByName()
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
