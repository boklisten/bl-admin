import { TestBed, inject } from '@angular/core/testing';

import { OrderItemPriceService } from './order-item-price.service';

describe('OrderItemPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderItemPriceService]
    });
  });

  it('should be created', inject([OrderItemPriceService], (service: OrderItemPriceService) => {
    expect(service).toBeTruthy();
  }));
});
