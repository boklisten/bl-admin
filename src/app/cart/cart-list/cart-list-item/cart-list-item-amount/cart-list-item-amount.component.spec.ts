import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListItemAmountComponent } from './cart-list-item-amount.component';

describe('CartListItemAmountComponent', () => {
  let component: CartListItemAmountComponent;
  let fixture: ComponentFixture<CartListItemAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartListItemAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartListItemAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
