import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderItemListComponent } from './customer-order-item-list.component';

describe('CustomerOrderItemListComponent', () => {
  let component: CustomerOrderItemListComponent;
  let fixture: ComponentFixture<CustomerOrderItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrderItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrderItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
