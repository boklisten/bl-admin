import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlcBranchSelectComponent } from './blc-branch-select.component';

describe('BlcBranchSelectComponent', () => {
  let component: BlcBranchSelectComponent;
  let fixture: ComponentFixture<BlcBranchSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlcBranchSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlcBranchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
