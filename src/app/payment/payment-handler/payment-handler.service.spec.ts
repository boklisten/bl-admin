import { TestBed, inject } from '@angular/core/testing';

import { PaymentHandlerService } from './payment-handler.service';

describe('PaymentHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentHandlerService]
    });
  });

  it('should be created', inject([PaymentHandlerService], (service: PaymentHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
