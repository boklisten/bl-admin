import { TestBed, inject } from '@angular/core/testing';

import { ItemPriceService } from './item-price.service';

describe('ItemPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemPriceService]
    });
  });

  it('should be created', inject([ItemPriceService], (service: ItemPriceService) => {
    expect(service).toBeTruthy();
  }));
});
