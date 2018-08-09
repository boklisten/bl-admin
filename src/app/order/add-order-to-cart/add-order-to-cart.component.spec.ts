import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderToCartComponent } from './add-order-to-cart.component';

describe('AddOrderToCartComponent', () => {
  let component: AddOrderToCartComponent;
  let fixture: ComponentFixture<AddOrderToCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderToCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
