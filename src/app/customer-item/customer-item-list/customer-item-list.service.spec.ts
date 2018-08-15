import { TestBed, inject } from '@angular/core/testing';

import { CustomerItemListService } from './customer-item-list.service';

describe('CustomerItemListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerItemListService]
    });
  });

  it('should be created', inject([CustomerItemListService], (service: CustomerItemListService) => {
    expect(service).toBeTruthy();
  }));
});
