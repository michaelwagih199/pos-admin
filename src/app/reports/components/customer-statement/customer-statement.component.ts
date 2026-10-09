import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { Arabic } from 'src/app/text';
import {
  CustomerStatement,
  CustomerStatementService,
} from '../../service/customer-statement.service';

@Component({
  selector: 'app-customer-statement',
  templateUrl: './customer-statement.component.html',
  styleUrls: ['./customer-statement.component.scss'],
})
export class CustomerStatementComponent implements OnInit {
  arabic: Arabic = new Arabic();

  customerControl = new FormControl('');
  allCustomers: CustomerModel[] = [];
  filteredCustomers!: Observable<CustomerModel[]>;

  selectedCustomer: CustomerModel | null = null;

  fromDate: Date = this.startOfMonth();
  toDate: Date = new Date();

  statement: CustomerStatement | null = null;
  isLoading = false;
  loaded = false;
  now: Date = new Date();

  constructor(
    private customerService: CustomerService,
    private statementService: CustomerStatementService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.customerService
      .getAllPagination({ page: 0, size: 1000, sortBy: 'customerName' })
      .subscribe(
        (res: any) => {
          this.allCustomers = res?.customers ?? [];
          this.filteredCustomers = this.customerControl.valueChanges.pipe(
            startWith(''),
            map((v) => this.filter(v))
          );
        },
        (err) => console.error(err)
      );
  }

  private filter(value: string | CustomerModel): CustomerModel[] {
    const text = (typeof value === 'string' ? value : value?.customerName ?? '')
      .toLowerCase()
      .trim();
    if (!text) return this.allCustomers.slice(0, 50);
    return this.allCustomers.filter((c) =>
      c.customerName?.toLowerCase().includes(text)
    );
  }

  displayFn(customer: CustomerModel | string | null): string {
    if (!customer) return '';
    return typeof customer === 'string' ? customer : customer.customerName ?? '';
  }

  onCustomerSelected(customer: CustomerModel) {
    if (!customer || !customer.id) return;
    this.selectedCustomer = customer;
  }

  loadStatement() {
    if (!this.selectedCustomer) return;

    this.isLoading = true;
    this.statementService
      .getStatement(
        this.selectedCustomer.id,
        this.formatDate(this.fromDate),
        this.formatDate(this.toDate)
      )
      .subscribe({
        next: (res) => {
          this.statement = res;
          this.isLoading = false;
          this.loaded = true;
        },
        error: (err) => {
          console.error(err);
          this.statement = null;
          this.isLoading = false;
          this.loaded = true;
        },
      });
  }


  openDetailedStatement(): void {
  if (!this.selectedCustomer) return;

  const from = this.formatDate(this.fromDate);
  const to   = this.formatDate(this.toDate);

  this.isLoading = true;
  this.statementService
    .getDetailedHtml(this.selectedCustomer.id, from, to)
    .subscribe({
      next: (html) => {
        this.isLoading = false;
        const w = window.open('', '_blank');
        if (w) {
          w.document.open();
          w.document.write(html);
          w.document.close();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load statement', err);
      },
    });
}

  print() {
    window.print();
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private startOfMonth(): Date {
    const d = new Date();
    d.setDate(1);
    return d;
  }
}
