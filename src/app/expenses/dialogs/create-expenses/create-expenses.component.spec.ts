import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExpensesComponent } from './create-expenses.component';

describe('CreateExpensesComponent', () => {
  let component: CreateExpensesComponent;
  let fixture: ComponentFixture<CreateExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
