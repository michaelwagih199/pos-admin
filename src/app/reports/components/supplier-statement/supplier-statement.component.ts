import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Supplier } from 'src/app/suppliers/models/supplier';
import { SupliersService } from 'src/app/suppliers/service/supliers.service';
import { Arabic } from 'src/app/text';
import {
  DetailedSupplierStatement,
  SupplierStatementService,
} from '../../service/supplier-statement.service';

@Component({
  selector: 'app-supplier-statement',
  templateUrl: './supplier-statement.component.html',
  styleUrls: ['./supplier-statement.component.scss'],
})
export class SupplierStatementComponent implements OnInit {
  arabic: Arabic = new Arabic();

  supplierControl = new FormControl('');
  allSuppliers: Supplier[] = [];
  filteredSuppliers!: Observable<Supplier[]>;

  selectedSupplier: Supplier | null = null;

  fromDate: Date = this.startOfMonth();
  toDate: Date = new Date();

  statement: DetailedSupplierStatement | null = null;
  isLoading = false;
  loaded = false;
  now: Date = new Date();

  constructor(
    private supliersService: SupliersService,
    private statementService: SupplierStatementService
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private loadSuppliers() {
    this.supliersService
      .getAllPagination({ page: 0, size: 1000, sortBy: 'supplierName' })
      .subscribe(
        (res: any) => {
          this.allSuppliers = res?.suppliers ?? [];
          this.filteredSuppliers = this.supplierControl.valueChanges.pipe(
            startWith(''),
            map((v) => this.filter(v))
          );
        },
        (err) => console.error(err)
      );
  }

  private filter(value: string | Supplier): Supplier[] {
    const text = (typeof value === 'string' ? value : value?.supplierName ?? '')
      .toLowerCase()
      .trim();
    if (!text) return this.allSuppliers.slice(0, 50);
    return this.allSuppliers.filter((s) =>
      s.supplierName?.toLowerCase().includes(text)
    );
  }

  displayFn(supplier: Supplier | string | null): string {
    if (!supplier) return '';
    return typeof supplier === 'string' ? supplier : supplier.supplierName ?? '';
  }

  onSupplierSelected(supplier: Supplier) {
    if (!supplier || !supplier.id) return;
    this.selectedSupplier = supplier;
  }

  loadStatement() {
    if (!this.selectedSupplier) return;

    this.isLoading = true;
    this.statementService
      .getDetailedJson(
        this.selectedSupplier.id,
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
    if (!this.selectedSupplier) return;

    const from = this.formatDate(this.fromDate);
    const to = this.formatDate(this.toDate);

    this.isLoading = true;
    this.statementService
      .getDetailedHtml(this.selectedSupplier.id, from, to)
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
