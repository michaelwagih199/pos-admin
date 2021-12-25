import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeReportComponent } from './safe-report.component';

describe('SafeReportComponent', () => {
  let component: SafeReportComponent;
  let fixture: ComponentFixture<SafeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
