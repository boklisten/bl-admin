import { TestBed, inject } from '@angular/core/testing';

import { CartItemSearchService } from './cart-item-search.service';

describe('CartItemSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartItemSearchService]
    });
  });

  it('should be created', inject([CartItemSearchService], (service: CartItemSearchService) => {
    expect(service).toBeTruthy();
  }));
});
