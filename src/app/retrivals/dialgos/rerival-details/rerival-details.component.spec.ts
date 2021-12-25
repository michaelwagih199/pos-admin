import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RerivalDetailsComponent } from './rerival-details.component';

describe('RerivalDetailsComponent', () => {
  let component: RerivalDetailsComponent;
  let fixture: ComponentFixture<RerivalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RerivalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RerivalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
