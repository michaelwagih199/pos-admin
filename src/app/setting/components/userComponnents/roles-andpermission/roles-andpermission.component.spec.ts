import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAndpermissionComponent } from './roles-andpermission.component';

describe('RolesAndpermissionComponent', () => {
  let component: RolesAndpermissionComponent;
  let fixture: ComponentFixture<RolesAndpermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesAndpermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAndpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
