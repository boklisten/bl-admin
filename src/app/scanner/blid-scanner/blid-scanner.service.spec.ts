import { TestBed } from '@angular/core/testing';

import { BlidScannerService } from './blid-scanner.service';

describe('BlidScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlidScannerService = TestBed.get(BlidScannerService);
    expect(service).toBeTruthy();
  });
});
