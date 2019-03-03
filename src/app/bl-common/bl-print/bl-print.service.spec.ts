import { TestBed } from '@angular/core/testing';

import { BlPrintService } from './bl-print.service';

describe('BlPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlPrintService = TestBed.get(BlPrintService);
    expect(service).toBeTruthy();
  });
});
