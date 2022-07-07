import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicOrdersComponent } from './dynamic-orders.component';

describe('DynamicOrdersComponent', () => {
  let component: DynamicOrdersComponent;
  let fixture: ComponentFixture<DynamicOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
