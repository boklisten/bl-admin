import { TestBed } from '@angular/core/testing';

import { IsbnScannerService } from './isbn-scanner.service';

describe('IsbnScannerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsbnScannerService = TestBed.get(IsbnScannerService);
    expect(service).toBeTruthy();
  });
});
