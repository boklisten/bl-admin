import { TestBed, inject } from '@angular/core/testing';

import { BranchItemStoreService } from './branch-item-store.service';

describe('BranchItemStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchItemStoreService]
    });
  });

  it('should be created', inject([BranchItemStoreService], (service: BranchItemStoreService) => {
    expect(service).toBeTruthy();
  }));
});
