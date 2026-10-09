import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,
  ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RetrivalsDetailsModel } from '../../models/retrivals-details-model';
import { ReturnableProduct } from '../../models/returnable-product';
import { ReturnType } from '../../models/retrivals-model';

interface DialogData {
  product: ReturnableProduct;
  returnType: ReturnType;
}

@Component({
  selector: 'app-return-product-dialog',
  templateUrl: './return-product-dialog.component.html',
  styleUrls: ['./return-product-dialog.component.scss'],
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
  multiInvoiceInvoices: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ReturnProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    const p = this.data.product;
    this.multiInvoiceInvoices = p.invoices ?? [];

    const firstAvailable = this.multiInvoiceInvoices.find(
      (inv) => Number(inv.returnableQty) > 0
    );
    const initialInvoice = firstAvailable ?? this.multiInvoiceInvoices[0];

    // Rolls ceiling
    this.maxQty = Number(initialInvoice?.returnableQty ?? p.availableCanvases ?? 0);

    // Units ceiling — comes from the DTO, NOT computed from rolls
    this.maxUnits = Number(
      (initialInvoice as any)?.returnableUnits
      ?? (p as any).availableUnits
      ?? 0
    );

    // Default per-unit value = the whole remaining units (user can lower it)
    const defaultUnitValue = this.maxUnits > 0 ? this.maxUnits : 1;
    const rollsMin = this.maxQty > 0 ? 1 : 0;
    const rollsDefault = this.maxQty > 0 ? 1 : 0;
    this.form = this.fb.group(
      {
        sourceDetailId: [
          initialInvoice?.saleOrderDetailId
          ?? initialInvoice?.purchasesBillDetailId
          ?? null,
        ],
        quantity: [
          rollsDefault,
          [Validators.required, Validators.min(rollsMin), Validators.max(this.maxQty)],
        ],
        unitNumber: [
          defaultUnitValue,
          [Validators.required, Validators.min(0.001), Validators.max(this.maxUnits)],
        ],
        condition: ['GOOD', Validators.required],
        reason: ['', Validators.required],
        notes: [''],
      },
      { validators: this.returnableValidator() }
    );
    this.form.get('sourceDetailId')?.valueChanges.subscribe((id) => {
      const inv = this.multiInvoiceInvoices.find(
        (i) => (i.saleOrderDetailId ?? i.purchasesBillDetailId) === id
      );
      if (!inv) return;

      this.maxQty = Number(inv.returnableQty) || 0;
      this.maxUnits = Number(inv.returnableUnits) || 0;

      const rollsMin = this.maxQty > 0 ? 1 : 0;      // ← add

      const qtyCtrl = this.form.get('quantity');
      const unitCtrl = this.form.get('unitNumber');

      qtyCtrl?.setValidators([
        Validators.required,
        Validators.min(rollsMin),                    // ← was min(1)
        Validators.max(this.maxQty),
      ]);
      unitCtrl?.setValidators([
        Validators.required,
        Validators.min(0.001),
        Validators.max(this.maxUnits),
      ]);
      qtyCtrl?.updateValueAndValidity();
      unitCtrl?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    });
  }

  private returnableValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const qty = Number(group.get('quantity')?.value ?? 0);
      const unit = Number(group.get('unitNumber')?.value ?? 0);
      const errs: ValidationErrors = {};

      // Rolls and units are INDEPENDENT ceilings — no multiplication
      if (qty > this.maxQty) errs['quantityOverflow'] = true;
      if (unit > this.maxUnits) errs['unitsOverflow'] = true;

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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;
    const p = this.data.product;
    const unitPrice = p.lastPrice ?? 0;

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
      sourceSaleOrderDetailId:
        this.data.returnType === 'CUSTOMER'
          ? v.sourceDetailId ?? undefined
          : undefined,
      sourcePurchasesBillDetailId:
        this.data.returnType === 'SUPPLIER'
          ? v.sourceDetailId ?? undefined
          : undefined,
    };

    this.ref.close(line);
  }

  close(): void {
    this.ref.close();
  }
}
