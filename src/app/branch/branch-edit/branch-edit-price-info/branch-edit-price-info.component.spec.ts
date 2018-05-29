import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchEditPriceInfoComponent } from './branch-edit-price-info.component';

describe('BranchEditPriceInfoComponent', () => {
  let component: BranchEditPriceInfoComponent;
  let fixture: ComponentFixture<BranchEditPriceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchEditPriceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchEditPriceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
