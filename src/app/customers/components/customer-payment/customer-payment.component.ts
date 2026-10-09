import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { CustomerPaymentModel } from 'src/app/customers/model/customer-payment';
import { CustomerPaymentService } from 'src/app/customers/service/customer-payment.service';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { Arabic } from 'src/app/text';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.scss'],
})
export class CustomerPaymentComponent implements OnInit {
  arabic: Arabic = new Arabic();
  validateForm!: FormGroup;

  // Autocomplete over full CustomerModel objects (loaded once)
  customerControl = new FormControl('');
  allCustomers: CustomerModel[] = [];
  filteredCustomers!: Observable<CustomerModel[]>;

  selectedCustomer: CustomerModel | null = null;
  currentBalance = 0;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private customerPaymentService: CustomerPaymentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      paymentDate: [this.today(), [Validators.required]],
      paymentValue: [null, [Validators.required, Validators.min(0.01)]],
      notes: [null],
    });
    this.loadCustomers();
  }

  // ---------- Data ----------
  /**
   * Loads ALL active customers once (excludes archived + DEFAULT_CUSTOMER).
   * Backend paginated endpoint is reused with a large page size — no new API needed.
   */
  private loadCustomers() {
    this.isLoading = true;
    this.customerService
      .getAllPagination({ page: 0, size: 1000, sortBy: 'customerName' })
      .subscribe(
        (res: any) => {
          this.allCustomers = res?.customers ?? [];
          this.isLoading = false;
          this.filteredCustomers = this.customerControl.valueChanges.pipe(
            startWith(''),
            map((v) => this.filter(v))
          );
        },
        (err) => {
          this.isLoading = false;
          console.error(err);
        }
      );
  }

  private filter(value: string | CustomerModel): CustomerModel[] {
    const text = (typeof value === 'string' ? value : value?.customerName ?? '')
      .toLowerCase()
      .trim();
    if (!text) return this.allCustomers.slice(0, 50); // cap initial dropdown
    return this.allCustomers.filter((c) =>
      c.customerName?.toLowerCase().includes(text)
    );
  }

  // ---------- Events ----------
  /** Display the customer's name in the input box */
  displayFn(customer: CustomerModel | string | null): string {
    if (!customer) return '';
    return typeof customer === 'string' ? customer : customer.customerName ?? '';
  }

  /** Called when user picks a suggestion — object already available, no extra lookup */
  onCustomerSelected(customer: CustomerModel) {
    if (!customer || !customer.id) return;
    this.selectedCustomer = customer;
    this.loadBalance(customer.id);
  }

  private loadBalance(customerId: number) {
    this.isLoading = true;

    forkJoin({
      netCost: this.customerPaymentService.getcustomerNetCostOrder(customerId),
      totalPaid: this.customerPaymentService.getAllPayment(customerId),
    }).subscribe({
      next: ({ netCost, totalPaid }) => {
        const net = Number(netCost) || 0;
        const paid = Number(totalPaid) || 0;
        this.currentBalance = net - paid;   // 👈 matches payments tab exactly
        this.isLoading = false;
      },
      error: (err) => {
        this.currentBalance = 0;
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  save() {
    if (!this.selectedCustomer) {
      this.toast(this.arabic.customerPayment.customerRequired);
      return;
    }
    if (this.validateForm.invalid) {
      this.validateForm.markAllAsTouched();
      return;
    }

    const v = this.validateForm.value;
    const payload: CustomerPaymentModel = {
      ...new CustomerPaymentModel(),
      paymentDate: v.paymentDate,
      paymentValue: v.paymentValue,
      notes: v.notes || '',
      customer: this.selectedCustomer,
    };

    this.isLoading = true;
    this.customerPaymentService
      .createPayment(payload, this.selectedCustomer.id)
      .subscribe(
        () => {
          this.isLoading = false;
          this.toast(this.arabic.customerPayment.savedSuccess);
          this.loadBalance(this.selectedCustomer!.id);
          this.validateForm.patchValue({ paymentValue: null, notes: null });
        },
        (err) => {
          this.isLoading = false;
          this.toast(err?.error?.message || this.arabic.customerPayment.saveFailed);
        }
      );
  }

  reset() {
    this.selectedCustomer = null;
    this.currentBalance = 0;
    this.customerControl.setValue('');
    this.validateForm.reset({ paymentDate: this.today() });
  }

  // ---------- Computed ----------
  get remainingAfter(): number {
    const v = Number(this.validateForm?.get('paymentValue')?.value) || 0;
    return this.currentBalance - v;      // 👈 allow negative (credit balance)
  }

  get isOverPayment(): boolean {
    const v = Number(this.validateForm?.get('paymentValue')?.value) || 0;
    return !!this.selectedCustomer && this.currentBalance > 0 && v > this.currentBalance;
  }
  // ---------- Helpers ----------
  private today(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private toast(message: string) {
    this.snackBar.open(message, this.arabic.customerPayment.close, { duration: 3000 });
  }
}
