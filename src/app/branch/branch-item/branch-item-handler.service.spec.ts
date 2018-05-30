import { TestBed, inject } from '@angular/core/testing';

import { BranchItemHandlerService } from './branch-item-handler.service';

describe('BranchItemHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchItemHandlerService]
    });
  });

  it('should be created', inject([BranchItemHandlerService], (service: BranchItemHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
