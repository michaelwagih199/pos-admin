import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositWithdrawelsComponent } from './deposit-withdrawels.component';

describe('DepositWithdrawelsComponent', () => {
  let component: DepositWithdrawelsComponent;
  let fixture: ComponentFixture<DepositWithdrawelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositWithdrawelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositWithdrawelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
