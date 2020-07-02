import { TestBed } from '@angular/core/testing';

import { UniqueItemScanToCartService } from './unique-item-scan-to-cart.service';

describe('UniqueItemScanToCartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UniqueItemScanToCartService = TestBed.get(UniqueItemScanToCartService);
    expect(service).toBeTruthy();
  });
});
