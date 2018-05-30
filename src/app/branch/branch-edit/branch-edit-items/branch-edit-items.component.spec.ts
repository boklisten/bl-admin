import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchEditItemsComponent } from './branch-edit-items.component';

describe('BranchEditItemsComponent', () => {
  let component: BranchEditItemsComponent;
  let fixture: ComponentFixture<BranchEditItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchEditItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchEditItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
