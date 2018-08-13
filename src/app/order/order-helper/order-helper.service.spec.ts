import { TestBed, inject } from '@angular/core/testing';

import { OrderHelperService } from './order-helper.service';

describe('OrderHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderHelperService]
    });
  });

  it('should be created', inject([OrderHelperService], (service: OrderHelperService) => {
    expect(service).toBeTruthy();
  }));
});
