import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, Validator, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RetrivalsDetailsModel } from '../../models/retrivals-details-model';
import { ReturnableInvoiceLine, ReturnableProduct } from '../../models/returnable-product';
import { ReturnType } from '../../models/retrivals-model';
import { Dir } from '@angular/cdk/bidi';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatInput, MatHint, MatError } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/autocomplete';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { DecimalPipe, DatePipe } from '@angular/common';

interface DialogData {
  product: ReturnableProduct;
  returnType: ReturnType;
}

@Component({
    selector: 'app-return-product-dialog',
    templateUrl: './return-product-dialog.component.html',
    styleUrls: ['./return-product-dialog.component.scss'],
    imports: [Dir, MatIconButton, MatIcon, MatDivider, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatInput, MatHint, MatError, MatRadioGroup, MatRadioButton, MatButton, DecimalPipe, DatePipe]
})
export class ReturnProductDialogComponent implements OnInit {
  form!: FormGroup;

  reasons = [
    { value: 'DEFECT', label: 'عيب صناعة' },
    { value: 'WRONG_ITEM', label: 'منتج خاطئ' },
    { value: 'EXPIRED', label: 'منتهي الصلاحية' },
    { value: 'NOT_NEEDED', label: 'غير مطلوب' },
    { value: 'OTHER', label: 'أخرى' },
  ];

  maxQty = 0;
  maxUnits = 0;
  multiInvoiceInvoices: ReturnableInvoiceLine[] = [];

  // Toggle: true = auto-allocate across all invoices (LIFO), false = manual invoice selection
  useAllInvoices = new FormControl(true);

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ReturnProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    const p = this.data.product;
    this.multiInvoiceInvoices = (p.invoices ?? []).filter(
      (inv) => Number(inv.returnableUnits ?? 0) > 0
    );

    this.updateLimits();

    const rollsDefault = this.maxQty > 0 ? 1 : 0;
    const unitDefault = this.maxUnits > 0 ? this.maxUnits : 0;

    this.form = this.fb.group(
      {
        sourceDetailId: [
          null,
          // Required only when NOT using all invoices
          (control: AbstractControl) => this.useAllInvoices.value ? null : Validators.required(control)
        ],
        quantity: [
          rollsDefault,
          [Validators.required, Validators.min(0), Validators.max(this.maxQty)],
        ],
        unitNumber: [
          unitDefault,
          [Validators.required, Validators.min(0.001), Validators.max(this.maxUnits)],
        ],
        condition: ['GOOD', Validators.required],
        reason: ['', Validators.required],
        notes: [''],
        customPrice: [null, [Validators.min(0)]],
      },
      { validators: this.returnableValidator() }
    );

    this.applyPriceControlState();

    // React to invoice selection (manual mode)
    this.form.get('sourceDetailId')?.valueChanges.subscribe((id) => {
      if (this.useAllInvoices.value) return; // Ignore in auto mode
      const inv = this.multiInvoiceInvoices.find(
        (i) => (i.saleOrderDetailId ?? i.purchasesBillDetailId) === id
      );
      if (!inv) return;

      this.maxQty = Number(inv.returnableQty) || 0;
      this.maxUnits = Number(inv.returnableUnits) || 0;
      this.updateValidators();
    });

    // React to toggle change
    this.useAllInvoices.valueChanges.subscribe(() => {
      this.onToggleChange();
    });
  }

  private updateLimits(): void {
    const p = this.data.product;
    if (this.useAllInvoices.value) {
      // Aggregated across all invoices
      this.maxQty = Number(p.availableCanvases ?? 0);
      this.maxUnits = Number(p.availableUnits ?? 0);
    } else {
      // Per selected invoice
      const initialInvoice = this.multiInvoiceInvoices[0];
      this.maxQty = Number(initialInvoice?.returnableQty ?? 0);
      this.maxUnits = Number(initialInvoice?.returnableUnits ?? 0);
    }
  }

  private onToggleChange(): void {
    if (this.useAllInvoices.value) {
      // Auto mode: clear manual selection, use aggregated limits
      this.form.get('sourceDetailId')?.setValue(null, { emitEvent: false });
      this.form.get('sourceDetailId')?.clearValidators();
    } else {
      // Manual mode: restore first invoice selection if available
      const initialInvoice = this.multiInvoiceInvoices[0];
      this.form.get('sourceDetailId')?.setValue(
        initialInvoice?.saleOrderDetailId ?? initialInvoice?.purchasesBillDetailId ?? null,
        { emitEvent: false }
      );
      this.form.get('sourceDetailId')?.setValidators(Validators.required);
    }
    this.form.get('sourceDetailId')?.updateValueAndValidity();
    this.applyPriceControlState();
    this.updateLimits();
    this.updateValidators();
  }

  // Auto-LIFO prices each allocation from its own source invoice, so a single
  // override is meaningless there: the field is disabled and cleared.
  private applyPriceControlState(): void {
    const priceCtrl = this.form?.get('customPrice');
    if (!priceCtrl) return;
    if (this.useAllInvoices.value) {
      priceCtrl.setValue(null, { emitEvent: false });
      priceCtrl.disable({ emitEvent: false });
    } else {
      priceCtrl.enable({ emitEvent: false });
    }
  }

  private updateValidators(): void {
    const qtyCtrl = this.form.get('quantity');
    const unitCtrl = this.form.get('unitNumber');

    qtyCtrl?.setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(this.maxQty),
    ]);
    unitCtrl?.setValidators([
      Validators.required,
      Validators.min(0.001),
      Validators.max(this.maxUnits),
    ]);

    // Reset defaults based on new limits
    qtyCtrl?.setValue(this.maxQty > 0 ? 1 : 0, { emitEvent: false });
    unitCtrl?.setValue(this.maxUnits > 0 ? this.maxUnits : 0, { emitEvent: false });

    qtyCtrl?.updateValueAndValidity();
    unitCtrl?.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  private returnableValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const qty = Number(group.get('quantity')?.value ?? 0);
      const unit = Number(group.get('unitNumber')?.value ?? 0);
      const errs: ValidationErrors = {};

      // Rolls and units are INDEPENDENT ceilings — no multiplication
      if (qty > this.maxQty) errs['quantityOverflow'] = true;
      if (unit > this.maxUnits) errs['unitsOverflow'] = true;

      // Both dimensions cannot be zero simultaneously (returning nothing)
      if (qty === 0 && unit === 0) {
        errs['bothEmpty'] = true;
      }

      return Object.keys(errs).length ? errs : null;
    };
  }

  get totalUnits(): number {
    return Number(this.form?.get('unitNumber')?.value ?? 0);
  }
  get remainingUnits(): number {
    return Math.max(0, this.maxUnits - this.totalUnits);
  }


  get selectedInvoiceCode(): string | null {
    const id = this.form?.get('sourceDetailId')?.value;
    const inv = this.multiInvoiceInvoices.find(
      (i) => (i.saleOrderDetailId ?? i.purchasesBillDetailId) === id
    );
    return inv?.orderCode ?? null;
  }

  get measurementUnitLabel(): string {
    return this.data.product.measurementUnit === 'METER' ? 'متر' : 'كجم';
  }

  get availableLabel(): string {
    return this.useAllInvoices.value ? 'المتاح من كل الفواتير' : 'المتاح من هذه الفاتورة';
  }

  // Manual mode: the selected invoice's own line price.
  // Auto mode: display-only reference (backend allocates per source invoice).
  get sourceUnitPrice(): number | null {
    const p = this.data.product;
    if (this.useAllInvoices.value) {
      return p.lastPrice != null ? Number(p.lastPrice) : null;
    }
    const id = this.form?.get('sourceDetailId')?.value;
    const inv = this.multiInvoiceInvoices.find(
      (i) => (i.saleOrderDetailId ?? i.purchasesBillDetailId) === id
    );
    const price = inv?.price ?? p.lastPrice;
    return price != null ? Number(price) : null;
  }

  save(): void {
    // Both dimensions must have at least one non-zero value
    const qty  = Number(this.form.get('quantity')?.value ?? 0);
    const unit = Number(this.form.get('unitNumber')?.value ?? 0);
    if (qty === 0 && unit === 0) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const p = this.data.product;
    const unitPrice = v.customPrice ?? this.sourceUnitPrice ?? 0;

    // When using all invoices, emit undefined source IDs so backend allocates LIFO
    const sourceSaleOrderDetailId = this.useAllInvoices.value && this.data.returnType === 'CUSTOMER'
      ? undefined
      : (this.data.returnType === 'CUSTOMER' ? v.sourceDetailId ?? undefined : undefined);
    const sourcePurchasesBillDetailId = this.useAllInvoices.value && this.data.returnType === 'SUPPLIER'
      ? undefined
      : (this.data.returnType === 'SUPPLIER' ? v.sourceDetailId ?? undefined : undefined);

    const line: RetrivalsDetailsModel = {
      id: 0,
      productId: p.productId,
      productName: p.productName,
      productCode: p.productCode ?? '',
      quantity: v.quantity,
      unitNumber: v.unitNumber,
      price: unitPrice,
      total: v.unitNumber * unitPrice,
      returnCondition: v.condition,
      returnReason: v.reason,
      sourceSaleOrderDetailId,
      sourcePurchasesBillDetailId,
    };

    this.ref.close(line);
  }

  close(): void {
    this.ref.close();
  }
}