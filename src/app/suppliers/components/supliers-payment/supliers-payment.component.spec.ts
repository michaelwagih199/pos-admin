import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupliersPaymentComponent } from './supliers-payment.component';

describe('SupliersPaymentComponent', () => {
  let component: SupliersPaymentComponent;
  let fixture: ComponentFixture<SupliersPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupliersPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupliersPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
