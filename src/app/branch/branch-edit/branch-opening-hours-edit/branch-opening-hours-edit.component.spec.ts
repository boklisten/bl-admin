import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchOpeningHoursEditComponent } from './branch-opening-hours-edit.component';

describe('BranchOpeningHoursEditComponent', () => {
  let component: BranchOpeningHoursEditComponent;
  let fixture: ComponentFixture<BranchOpeningHoursEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchOpeningHoursEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchOpeningHoursEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
