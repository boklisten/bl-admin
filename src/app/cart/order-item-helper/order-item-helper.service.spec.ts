import { TestBed, inject } from '@angular/core/testing';

import { OrderItemHelperService } from './order-item-helper.service';

describe('OrderItemHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderItemHelperService]
    });
  });

  it('should be created', inject([OrderItemHelperService], (service: OrderItemHelperService) => {
    expect(service).toBeTruthy();
  }));
});
