import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTailerTasksComponent } from './add-tailer-tasks.component';

describe('AddTailerTasksComponent', () => {
  let component: AddTailerTasksComponent;
  let fixture: ComponentFixture<AddTailerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTailerTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTailerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
