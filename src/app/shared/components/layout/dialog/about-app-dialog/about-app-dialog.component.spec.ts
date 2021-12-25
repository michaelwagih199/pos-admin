import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAppDialogComponent } from './about-app-dialog.component';

describe('AboutAppDialogComponent', () => {
  let component: AboutAppDialogComponent;
  let fixture: ComponentFixture<AboutAppDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutAppDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
