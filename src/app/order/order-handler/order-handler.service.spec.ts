import { TestBed, inject } from '@angular/core/testing';

import { OrderHandlerService } from './order-handler.service';

describe('OrderHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderHandlerService]
    });
  });

  it('should be created', inject([OrderHandlerService], (service: OrderHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
