import { TestBed, inject } from '@angular/core/testing';

import { CustomerOrderItemListService } from './customer-order-item-list.service';

describe('CustomerOrderItemListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerOrderItemListService]
    });
  });

  it('should be created', inject([CustomerOrderItemListService], (service: CustomerOrderItemListService) => {
    expect(service).toBeTruthy();
  }));
});
