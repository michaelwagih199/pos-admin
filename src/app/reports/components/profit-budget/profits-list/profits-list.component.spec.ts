import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitsListComponent } from './profits-list.component';

describe('ProfitsListComponent', () => {
  let component: ProfitsListComponent;
  let fixture: ComponentFixture<ProfitsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfitsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
