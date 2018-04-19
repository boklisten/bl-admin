import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailCardComponent } from './order-detail-card.component';

describe('OrderDetailCardComponent', () => {
  let component: OrderDetailCardComponent;
  let fixture: ComponentFixture<OrderDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
