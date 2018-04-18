import { TestBed, inject } from '@angular/core/testing';

import { CustomerOrderService } from './customer-order.service';

describe('CustomerOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerOrderService]
    });
  });

  it('should be created', inject([CustomerOrderService], (service: CustomerOrderService) => {
    expect(service).toBeTruthy();
  }));
});
