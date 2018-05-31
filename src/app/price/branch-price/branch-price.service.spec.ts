import { TestBed, inject } from '@angular/core/testing';

import { BranchPriceService } from './branch-price.service';

describe('BranchPriceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchPriceService]
    });
  });

  it('should be created', inject([BranchPriceService], (service: BranchPriceService) => {
    expect(service).toBeTruthy();
  }));
});
