import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchItemCategorySelectComponent } from './branch-item-category-select.component';

describe('BranchItemCategorySelectComponent', () => {
  let component: BranchItemCategorySelectComponent;
  let fixture: ComponentFixture<BranchItemCategorySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchItemCategorySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchItemCategorySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
