import { TestBed, inject } from '@angular/core/testing';

import { BlcScannerService } from './blc-scanner.service';

describe('BlcScannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlcScannerService]
    });
  });

  it('should be created', inject([BlcScannerService], (service: BlcScannerService) => {
    expect(service).toBeTruthy();
  }));
});
