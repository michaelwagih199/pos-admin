import { of, Subject } from 'rxjs';

import { RetrivalsDetailsModel } from '../../models/retrivals-details-model';
import { ReturnableProduct } from '../../models/returnable-product';
import { RetrievalWizardComponent } from './retrieval-wizard.component';

describe('RetrievalWizardComponent — price-aware cart merge', () => {
  const product: ReturnableProduct = {
    productId: 1,
    productName: 'Fabric',
    productCode: 'F-1',
    measurementUnit: 'METER',
    availableUnits: 30,
    availableCanvases: 3,
    lastPrice: 5,
    invoices: [],
  };

  function makeWizard() {
    let afterClosed!: Subject<RetrivalsDetailsModel | undefined>;
    const dialog = {
      open: vi.fn(() => {
        afterClosed = new Subject<RetrivalsDetailsModel | undefined>();
        return { afterClosed: () => afterClosed.asObservable() };
      }),
    };
    const router = { navigate: () => Promise.resolve(true) };
    const snack = { open: () => undefined };
    const customerService = { search: () => new Subject() };
    const supplierService = { search: () => new Subject() };
    const retrievalService = { getReturnableProducts: () => new Subject() };

    const component = new RetrievalWizardComponent(
      dialog as any,
      router as any,
      snack as any,
      customerService as any,
      supplierService as any,
      retrievalService as any
    );

    const addLine = (line: RetrivalsDetailsModel) => {
      component.openReturnDialog(product);
      afterClosed.next(line);
    };

    return { component, addLine, customerService, supplierService };
  }

  function line(price: number, units: number, rolls = 1): RetrivalsDetailsModel {
    return {
      id: 0,
      productId: 1,
      productName: 'Fabric',
      productCode: 'F-1',
      quantity: rolls,
      unitNumber: units,
      price,
      total: units * price,
      returnCondition: 'GOOD',
      returnReason: 'NOT_NEEDED',
    };
  }

  it('keeps two lines when the same product has different prices', () => {
    const { component, addLine } = makeWizard();

    addLine(line(7, 2));
    addLine(line(9, 3));

    expect(component.cart.length).toBe(2);
    expect(component.cart.map((l) => l.price)).toEqual([7, 9]);
    expect(component.subtotal).toBe(14 + 27);
  });

  it('merges equal-price lines and recomputes units-only totals', () => {
    const { component, addLine } = makeWizard();

    addLine(line(7, 2, 1));
    addLine(line(7, 3, 2));

    expect(component.cart.length).toBe(1);
    expect(component.cart[0].quantity).toBe(3);   // rolls accumulate, never multiply money
    expect(component.cart[0].unitNumber).toBe(5);
    expect(component.cart[0].total).toBe(35);     // 5 units * 7
  });
});

describe('RetrievalWizardComponent — person autocomplete', () => {
  function makeWizard(customerSearch: any = () => new Subject(), supplierSearch: any = () => new Subject()) {
    const dialog = { open: vi.fn(() => ({ afterClosed: () => new Subject() })) };
    const router = { navigate: () => Promise.resolve(true) };
    const snack = { open: () => undefined };
    const retrievalService = { getReturnableProducts: () => of({ data: [] }) };

    const component = new RetrievalWizardComponent(
      dialog as any,
      router as any,
      snack as any,
      { search: customerSearch } as any,
      { search: supplierSearch } as any,
      retrievalService as any
    );

    return { component, dialog };
  }

  it('formats an object by name and passes raw strings through', () => {
    const { component } = makeWizard();

    expect(component.displayPerson({ id: 1, name: 'أحمد' })).toBe('أحمد');
    expect(component.displayPerson('أح')).toBe('أح');
    expect(component.displayPerson(null)).toBe('');
  });

  it('does not call the API for a single character', () => {
    vi.useFakeTimers();
    try {
      const search = vi.fn(() => of<any[]>([]));
      const { component } = makeWizard(search);
      component.ngOnInit();
      const emitted: any[][] = [];
      component.filteredPeople.subscribe((v) => emitted.push(v));

      component.searchCtrl.setValue('أ');
      vi.advanceTimersByTime(300);

      expect(search).not.toHaveBeenCalled();
      expect(emitted[emitted.length - 1]).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('flags searching while the live request is pending and clears it on emission', () => {
    vi.useFakeTimers();
    try {
      const pending = new Subject<any[]>();
      const search = vi.fn(() => pending.asObservable());
      const { component } = makeWizard(search);
      component.ngOnInit();
      component.filteredPeople.subscribe(() => undefined);

      component.searchCtrl.setValue('أح');
      vi.advanceTimersByTime(300);

      expect(search).toHaveBeenCalledWith('أح');
      expect(component.searching).toBe(true);

      pending.next([{ id: 1, customerName: 'أحمد', customerPhone: '010' }]);
      expect(component.searching).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('clears the cart and discount when the person changes', () => {
    const { component } = makeWizard();
    const first = { id: 1, name: 'أحمد' };
    const second = { id: 2, name: 'محمود' };

    component.onPersonSelected(first);
    component.cart = [{ productId: 1, unitNumber: 2, price: 7, total: 14 } as any];
    component.discount = 10;

    component.onPersonSelected(second);

    expect(component.selectedPerson).toEqual(second);
    expect(component.cart).toEqual([]);
    expect(component.discount).toBe(0);
  });
});
