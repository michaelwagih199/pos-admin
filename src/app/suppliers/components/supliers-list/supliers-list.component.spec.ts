import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupliersListComponent } from './supliers-list.component';

describe('SupliersListComponent', () => {
  let component: SupliersListComponent;
  let fixture: ComponentFixture<SupliersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupliersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupliersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
