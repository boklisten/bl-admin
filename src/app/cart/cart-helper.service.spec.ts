import { TestBed, inject } from '@angular/core/testing';

import { CartHelperService } from './cart-helper.service';

describe('CartHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartHelperService]
    });
  });

  it('should be created', inject([CartHelperService], (service: CartHelperService) => {
    expect(service).toBeTruthy();
  }));
});
