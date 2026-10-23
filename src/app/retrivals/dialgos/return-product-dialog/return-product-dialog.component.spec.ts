import { FormBuilder } from '@angular/forms';

import { ReturnableProduct } from '../../models/returnable-product';
import { RetrivalsDetailsModel } from '../../models/retrivals-details-model';
import { ReturnProductDialogComponent } from './return-product-dialog.component';

const product: ReturnableProduct = {
  productId: 1,
  productName: 'Fabric',
  productCode: 'F-1',
  measurementUnit: 'METER',
  availableUnits: 30,
  availableCanvases: 3,
  lastPrice: 5,
  invoices: [
    {
      saleOrderDetailId: 11,
      orderCode: 'SO-11',
      orderDate: '2026-01-01',
      returnableQty: 1,
      returnableUnits: 10,
      price: 4,
    },
    {
      saleOrderDetailId: 12,
      orderCode: 'SO-12',
      orderDate: '2026-01-02',
      returnableQty: 2,
      returnableUnits: 20,
      price: 7,
    },
  ],
};

describe('ReturnProductDialogComponent — manual price override', () => {
  function makeDialog() {
    const ref = { close: vi.fn() };
    const component = new ReturnProductDialogComponent(
      new FormBuilder(),
      ref as any,
      { product: structuredClone(product), returnType: 'CUSTOMER' }
    );
    component.ngOnInit();
    return { component, ref };
  }

  function selectManualInvoice(component: ReturnProductDialogComponent, id: number) {
    component.useAllInvoices.setValue(false);
    component.form.get('sourceDetailId')?.setValue(id);
  }

  function fillValidReturn(component: ReturnProductDialogComponent, units: number) {
    component.form.patchValue({
      quantity: 1,
      unitNumber: units,
      condition: 'GOOD',
      reason: 'NOT_NEEDED',
    });
  }

  it('uses the typed override price and units-only total', () => {
    const { component, ref } = makeDialog();
    selectManualInvoice(component, 11);
    fillValidReturn(component, 4);
    component.form.get('customPrice')?.setValue(3);

    component.save();

    const line = ref.close.mock.calls[0][0] as RetrivalsDetailsModel;
    expect(line.price).toBe(3);
    expect(line.total).toBe(12); // units * price, never rolls
  });

  it('falls back to the selected invoice price when the override is empty', () => {
    const { component, ref } = makeDialog();
    selectManualInvoice(component, 12);
    fillValidReturn(component, 2);

    expect(component.sourceUnitPrice).toBe(7);
    component.save();

    const line = ref.close.mock.calls[0][0] as RetrivalsDetailsModel;
    expect(line.price).toBe(7);
    expect(line.total).toBe(14);
  });

  it('disables and clears the price in auto LIFO mode', () => {
    const { component } = makeDialog();
    component.useAllInvoices.setValue(false);
    component.form.get('customPrice')?.setValue(9);

    component.useAllInvoices.setValue(true);

    const priceCtrl = component.form.get('customPrice');
    expect(priceCtrl?.disabled).toBe(true);
    expect(priceCtrl?.value).toBeNull();
  });

  it('never uses rolls in the line total', () => {
    const { component, ref } = makeDialog();
    selectManualInvoice(component, 12);
    fillValidReturn(component, 6);
    component.form.get('quantity')?.setValue(2);

    component.save();

    const line = ref.close.mock.calls[0][0] as RetrivalsDetailsModel;
    expect(line.quantity).toBe(2);
    expect(line.unitNumber).toBe(6);
    expect(line.total).toBe(6 * (line.price as number));
  });

  it('keeps the dialog open for a negative override', () => {
    const { component, ref } = makeDialog();
    selectManualInvoice(component, 11);
    fillValidReturn(component, 4);
    component.form.get('customPrice')?.setValue(-1);

    component.save();

    expect(component.form.get('customPrice')?.hasError('min')).toBe(true);
    expect(ref.close).not.toHaveBeenCalled();
  });
});

describe('ReturnProductDialogComponent — auto mode note', () => {
  it('reports lastPrice as the display-only reference in auto mode', () => {
    const component = new ReturnProductDialogComponent(
      new FormBuilder(),
      { close: () => undefined } as any,
      { product: structuredClone(product), returnType: 'CUSTOMER' }
    );
    component.ngOnInit();

    expect(component.useAllInvoices.value).toBe(true);
    expect(component.sourceUnitPrice).toBe(5);
  });
});
