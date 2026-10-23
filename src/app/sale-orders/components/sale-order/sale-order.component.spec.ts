import { FormBuilder } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DynamicDetailsDao } from '../../models/dynamic-order-request';
import { SaleOrderComponent } from './sale-order.component';

describe('SaleOrderComponent — manual price override', () => {
  function makeComponent() {
    const response = {
      data: {
        dynamicDetailsDao: [] as DynamicDetailsDao[],
        totalPrice: 0,
        message: 'Can Order Product',
        code: 200,
      },
    };

    const dynamicItemService = {
      findDynamicProductByCode: vi.fn(() => of(response)),
      findDynamicByName: vi.fn(() => of(response)),
    };
    const customerService = {
      getNames: () => of([]),
      findByName: () => of({}),
      create: () => of({}),
    };
    const productService = {
      getNames: () => of([]),
      getCodes: () => of([]),
    };
    const orderService = {
      getOrderCode: () => of('ORD-1'),
      createOrder: () => of({}),
    };
    const dialog = {};
    const modalService = { open: () => undefined, dismissAll: () => undefined };
    const snackBar = { open: () => undefined };
    const router = {
      navigate: () => Promise.resolve(true),
      navigateByUrl: () => Promise.resolve(true),
    };
    const dataServer = { changeMessage: () => undefined };

    const component = TestBed.runInInjectionContext(() => new SaleOrderComponent(
      customerService as any,
      dynamicItemService as any,
      productService as any,
      orderService as any,
      dialog as any,
      modalService as any,
      snackBar as any,
      new FormBuilder(),
      router as any,
      dataServer as any
    ));
    component.validateForm();

    return { component, dynamicItemService };
  }

  it('sends the typed custom price with a code lookup', () => {
    const { component, dynamicItemService } = makeComponent();

    component.findDynamicByCode('P-1', 5, 'CODE', 2, undefined, 12.5);

    expect(dynamicItemService.findDynamicProductByCode).toHaveBeenCalledWith(
      expect.objectContaining({
        productCode: 'P-1',
        canvasTopUnits: 5,
        quantity: 2,
        customPrice: 12.5,
      })
    );
  });

  it('sends null when the price field is empty', () => {
    const { component, dynamicItemService } = makeComponent();

    component.findDynamicByName('Fabric', 3, 'NAME', 1, null);

    expect(dynamicItemService.findDynamicByName).toHaveBeenCalledWith(
      expect.objectContaining({ productName: 'Fabric', customPrice: null })
    );
  });

  it('clears the typed price only after a successful add', () => {
    const { component } = makeComponent();
    component.producForm.get('customPrice')?.setValue(12.5);

    component.findDynamicByCode('P-1', 5, 'CODE', 1, undefined, 12.5);

    expect(component.producForm.get('customPrice')?.value).toBeNull();
  });

  it('preserves the line price when the edit-quantity modal opens', () => {
    const { component, dynamicItemService } = makeComponent();
    const item = Object.assign(new DynamicDetailsDao(), {
      productCode: 'P-1',
      productName: 'Fabric',
      price: 9.75,
      unitNumber: 4,
      quantity: 1,
      total: 39,
    });

    component.openUpdateQuantity({}, item);

    expect(component.quantityValidateForm.get('modalCustomPrice')?.value).toBe(9.75);

    component.onupdateQuantity();

    expect(dynamicItemService.findDynamicProductByCode).toHaveBeenCalledWith(
      expect.objectContaining({ productCode: 'P-1', customPrice: 9.75 })
    );
  });

  it('rejects a negative price in both forms', () => {
    const { component } = makeComponent();

    const searchPrice = component.producForm.get('customPrice');
    searchPrice?.setValue(-1);
    expect(searchPrice?.valid).toBe(false);

    const modalPrice = component.quantityValidateForm.get('modalCustomPrice');
    modalPrice?.setValue(-0.01);
    expect(modalPrice?.valid).toBe(false);
  });

  it('reset clears both price controls', () => {
    const { component } = makeComponent();
    component.producForm.get('customPrice')?.setValue(5);
    component.quantityValidateForm.get('modalCustomPrice')?.setValue(5);

    component.reset();

    expect(component.producForm.get('customPrice')?.value).toBeNull();
    expect(component.quantityValidateForm.get('modalCustomPrice')?.value).toBeNull();
  });
});
