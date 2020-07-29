import { TestBed } from '@angular/core/testing';

import { CartDeliveryService } from './cart-delivery.service';

describe('CartDeliveryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartDeliveryService = TestBed.get(CartDeliveryService);
    expect(service).toBeTruthy();
  });
});
