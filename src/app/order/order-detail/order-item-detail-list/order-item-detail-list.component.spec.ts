import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemDetailListComponent } from './order-item-detail-list.component';

describe('OrderItemDetailListComponent', () => {
  let component: OrderItemDetailListComponent;
  let fixture: ComponentFixture<OrderItemDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderItemDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderItemDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
