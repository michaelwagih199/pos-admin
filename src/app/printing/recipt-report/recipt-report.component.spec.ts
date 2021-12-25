import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptReportComponent } from './recipt-report.component';

describe('ReciptReportComponent', () => {
  let component: ReciptReportComponent;
  let fixture: ComponentFixture<ReciptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciptReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
