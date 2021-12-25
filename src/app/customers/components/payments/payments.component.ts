import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Arabic } from 'src/app/text';
import { CustomerPaymentModel } from '../../model/customer-payment';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerPaymentService } from '../../service/customer-payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerModel } from '../../model/customer-model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  private routeSub!: Subscription;
  validateForm!: FormGroup;
  arabic: Arabic = new Arabic()
  customerPayment: CustomerPaymentModel = new CustomerPaymentModel()
  customer: CustomerModel = new CustomerModel()
  customerId!: number
  isLoading: boolean = false
  allPayment: any = 0.0
  indebtedness: any = 0.0

  customerPaymentList!: CustomerPaymentModel[]
  //for tables
  displayedColumns: string[] = ['id', 'paymentDate', 'paymentValue', 'notes', 'actions']


  constructor(private fb: FormBuilder,
    private customerPaymentService: CustomerPaymentService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router, private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.validateform()
    this.getCustomerId()
    this.retrivePayment()
  }
  /**
   * data
   */
  getCustomerId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.customerId = params['id']
    });
  }

  retrivePayment() {
    this.isLoading = true
    const params = this.getRequestParams(this.page, this.pageSize);
    this.customerPaymentService.findByCustomerId(params, this.customerId)
      .subscribe(
        data => {
          this.isLoading = false
          this.customerPaymentList = data.customerPayment;
          this.count = data.totalItems;
          this.getAllPayment()
          this.getCustomerOrdersCost()
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }

  getAllPayment() {
    this.customerPaymentService.getAllPayment(this.customerId).subscribe(data => {
      this.allPayment = data
    }, error => console.log(error))
  }


  getCustomerOrdersCost() {
    this.customerPaymentService.getcustomerNetCostOrder(this.customerId).subscribe(data => {
      this.indebtedness = data
    }, error => console.log(error))
  }

  /**
   * events
   */

  addPayment() {
    this.isLoading = true
    this.customerPaymentService.createPayment(this.customerPayment, this.customerId)
      .subscribe(data => {
        this.isLoading = false
        this.openSnackBar(`${this.arabic.util.saved}`, '')
        this.retrivePayment()
        this.customerPayment = new CustomerPaymentModel()
      }, error => console.log(error))
  }


  deletePayment(obj: CustomerPaymentModel) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${obj.paymentValue}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.customerPaymentService.delete(obj.id).subscribe(data => {
          this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.deleted}`, '')
          this.retrivePayment()
         
        }, error => console.log(error))
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  /**
   * uiux 
   */
  validateform() {
    this.validateForm = this.fb.group({
      paymentValue: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      notes: [null,],
    });
  }

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
    this.retrivePayment();
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
