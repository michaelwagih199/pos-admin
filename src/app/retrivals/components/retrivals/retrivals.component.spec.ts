import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrivalsComponent } from './retrivals.component';

describe('RetrivalsComponent', () => {
  let component: RetrivalsComponent;
  let fixture: ComponentFixture<RetrivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetrivalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
