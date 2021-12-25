import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcodeComponent } from './parcode.component';

describe('ParcodeComponent', () => {
  let component: ParcodeComponent;
  let fixture: ComponentFixture<ParcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
