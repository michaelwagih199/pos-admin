import { Component, OnInit } from '@angular/core';
import { Arabic } from 'src/app/text';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith, map } from 'rxjs/operators';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer-model';
import { CreateCustomerComponent } from '../../dialogs/create-customer/create-customer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})

export class CustomerListComponent implements OnInit {


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
  filteredOptions!: Observable<string[]>

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.getAllNames()
    this.retrieve()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
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
    this.customerService.findByName(this.searchInout).subscribe(data => {
      this.customerList = data
      this.isLoading = false
    }, error => console.log(error))
  }

  refresh() {
    this.retrieve();
    this.searchInout = ''
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

  onCustomerDetails(id:number) {
    this.router.navigate([`customers/customerDetails/${id}`])
  }

  search() {
    this.findByName()
  }

  displayFn(value: any): string {
    console.log(value)
    this.searchInout = value
    return value;
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchInout = SelectedHuman;
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
