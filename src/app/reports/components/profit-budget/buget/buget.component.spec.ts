import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugetComponent } from './buget.component';

describe('BugetComponent', () => {
  let component: BugetComponent;
  let fixture: ComponentFixture<BugetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BugetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BugetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
