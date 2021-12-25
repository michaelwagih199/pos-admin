import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundReportComponent } from './compound-report.component';

describe('CompoundReportComponent', () => {
  let component: CompoundReportComponent;
  let fixture: ComponentFixture<CompoundReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompoundReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
