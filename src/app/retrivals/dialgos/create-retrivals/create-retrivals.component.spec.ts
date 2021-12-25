import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRetrivalsComponent } from './create-retrivals.component';

describe('CreateRetrivalsComponent', () => {
  let component: CreateRetrivalsComponent;
  let fixture: ComponentFixture<CreateRetrivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRetrivalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRetrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
