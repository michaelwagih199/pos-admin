import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';                                  // 👈 add
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, startWith } from 'rxjs/operators';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { SupliersService } from 'src/app/suppliers/service/supliers.service';
import { RetrivalsDetailsModel } from '../../models/retrivals-details-model';
import { RetrivalsModel, ReturnType, RefundMethod } from '../../models/retrivals-model';
import { ReturnableProduct } from '../../models/returnable-product';
import { RetrivalsService } from '../../service/retrivals.service';
import { ReturnProductDialogComponent } from '../return-product-dialog/return-product-dialog.component';
import { Dir } from '@angular/cdk/bidi';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { AsyncPipe, DecimalPipe, CurrencyPipe } from '@angular/common';

interface Person { id: number; name: string; phone?: string; }

@Component({
    selector: 'app-retrieval-wizard',
    templateUrl: './retrieval-wizard.component.html',
    styleUrls: ['./retrieval-wizard.component.scss'],
    imports: [Dir, MatIcon, MatButtonToggleGroup, ReactiveFormsModule, FormsModule, MatButtonToggle, MatButton, MatFormField, MatLabel, MatInput, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatSelect, AsyncPipe, DecimalPipe, CurrencyPipe]
})
export class RetrievalWizardComponent implements OnInit {
  step = 0;
  returnType: ReturnType = 'CUSTOMER';

  selectedPerson: Person | null = null;
  searchCtrl = new FormControl();
  filteredPeople: Observable<Person[]> = of([]);

  products: ReturnableProduct[] = [];
  loadingProducts = false;

  cart: RetrivalsDetailsModel[] = [];
  discount = 0;
  refundMethod: RefundMethod = 'CREDIT';
  saving = false;
  reviewColumns: string[] = ['product', 'pieces', 'units', 'condition', 'total'];

  constructor(
    private dialog: MatDialog,
    private router: Router,                    // 👈 was MatDialogRef
    private snack: MatSnackBar,
    private customerService: CustomerService,
    private supplierService: SupliersService,
    private retrievalService: RetrivalsService
  ) { }

  ngOnInit(): void {
    this.filteredPeople = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((term: string) => {
        const q = (term ?? '').trim();
        if (q.length < 2) return of([]);
        const obs$ = this.returnType === 'CUSTOMER'
          ? this.customerService.findByName(q)
          : this.supplierService.findByName(q);
        return obs$.pipe(catchError(() => of([])));
      }),
      map((res: any) => this.normalizePeople(res))
    );
  }

  private normalizePeople(res: any): Person[] {
    const list: any[] = Array.isArray(res) ? res : (res?.data ?? []);
    return list.map((p) => ({
      id: p.id,
      name: p.customerName ?? p.supplierName ?? '',
      phone: p.customerPhone ?? p.supplierPhone ?? '',
    }));
  }

  onPersonSelected(p: Person) {
    this.selectedPerson = p;
    this.step = 2;
    this.loadReturnable();
  }

  loadReturnable() {
    if (!this.selectedPerson) return;
    this.loadingProducts = true;
    this.retrievalService.getReturnableProducts(this.selectedPerson.id, this.returnType).subscribe({
      next: (res) => {
        const list: ReturnableProduct[] = res?.data ?? [];
        this.products = list.filter(p => (p.availableUnits ?? 0) > 0);
        this.loadingProducts = false;
        if (this.products.length === 0) {
          this.snack.open('لا توجد منتجات قابلة للإرجاع لهذا الشخص', '', { duration: 3000 });
        }
      },
      error: () => (this.loadingProducts = false),
    });
  }

  openReturnDialog(p: ReturnableProduct) {
    const ref = this.dialog.open(ReturnProductDialogComponent, {
      width: '560px',
      disableClose: true,
      data: { product: p, returnType: this.returnType },
    });

    ref.afterClosed().subscribe((line?: RetrivalsDetailsModel) => {
      if (!line) return;
      // Merge key: productId + returnCondition.
      // source IDs are intentionally excluded so multi-invoice lines (undefined) merge correctly.
      const i = this.cart.findIndex(l =>
        l.productId === line.productId
        && l.returnCondition === line.returnCondition
      );
      if (i > -1) {
        this.cart[i].quantity += line.quantity;      // rolls — metadata
        this.cart[i].unitNumber += line.unitNumber;    // units — accumulate
        this.cart[i].total = this.cart[i].unitNumber * this.cart[i].price;
      } else {
        this.cart.push(line);
      }
    });
  }

  removeLine(i: number) { this.cart.splice(i, 1); }

  get subtotal() { return this.cart.reduce((s, l) => s + (l.total || 0), 0); }
  get netTotal() { return Math.max(0, this.subtotal - (this.discount || 0)); }

  submit() {
    if (!this.selectedPerson || this.cart.length === 0) return;
    this.saving = true;

    const model: RetrivalsModel = {
      id: 0,
      retrievalsCode: '',
      totalCost: this.subtotal,
      discount: this.discount || 0,
      netCost: this.netTotal,
      createdDate: '',
      returnType: this.returnType,
      refundMethod: this.refundMethod,
      customer: this.returnType === 'CUSTOMER' ? (this.selectedPerson as any) : null,
      supplier: this.returnType === 'SUPPLIER' ? (this.selectedPerson as any) : null,
    };

    const payload = {
      model,
      returnType: this.returnType,
      refundMethod: this.refundMethod,
      notes: '',
      details: this.cart.map(l => ({
        productId: l.productId,
        quantity: l.quantity,
        unitNumber: l.unitNumber,
        price: l.price,
        returnCondition: l.returnCondition,
        returnReason: l.returnReason,
        sourceSaleOrderDetailId: l.sourceSaleOrderDetailId,
        sourcePurchasesBillDetailId: l.sourcePurchasesBillDetailId,
      })),
    };

    this.retrievalService.createRetrieval(payload, this.selectedPerson.id, this.returnType).subscribe({
      next: (res) => {
        this.saving = false;
        const code = res?.data?.retrievalsCode ?? '';
        this.snack.open(`تم حفظ المرتجع: ${code}`, '', { duration: 3000 });
        this.router.navigate(['/retrivals']);            // 👈 was dialogRef.close(true)
      },
      error: (e) => {
        this.saving = false;
        this.snack.open(e?.error?.message || 'فشل الحفظ', '', { duration: 4000 });
      },
    });
  }

  close() { this.router.navigate(['/retrivals']); }       // 👈 was dialogRef.close(false)
}
