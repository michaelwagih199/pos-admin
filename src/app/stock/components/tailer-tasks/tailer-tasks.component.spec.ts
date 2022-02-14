import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailerTasksComponent } from './tailer-tasks.component';

describe('TailerTasksComponent', () => {
  let component: TailerTasksComponent;
  let fixture: ComponentFixture<TailerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailerTasksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TailerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
