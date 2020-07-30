import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueItemScanOrderToCartComponent } from './unique-item-scan-order-to-cart.component';

describe('UniqueItemScanOrderToCartComponent', () => {
  let component: UniqueItemScanOrderToCartComponent;
  let fixture: ComponentFixture<UniqueItemScanOrderToCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueItemScanOrderToCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueItemScanOrderToCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
