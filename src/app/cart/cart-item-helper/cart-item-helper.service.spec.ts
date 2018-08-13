import { TestBed, inject } from '@angular/core/testing';

import { CartItemHelperService } from './cart-item-helper.service';

describe('CartItemHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartItemHelperService]
    });
  });

  it('should be created', inject([CartItemHelperService], (service: CartItemHelperService) => {
    expect(service).toBeTruthy();
  }));
});
