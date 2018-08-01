import { TestBed, inject } from '@angular/core/testing';

import { BranchHelperService } from './branch-helper.service';

describe('BranchHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchHelperService]
    });
  });

  it('should be created', inject([BranchHelperService], (service: BranchHelperService) => {
    expect(service).toBeTruthy();
  }));
});
