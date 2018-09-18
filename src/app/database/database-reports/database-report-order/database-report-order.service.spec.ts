import { TestBed, inject } from '@angular/core/testing';

import { DatabaseReportOrderService } from './database-report-order.service';

describe('DatabaseReportOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseReportOrderService]
    });
  });

  it('should be created', inject([DatabaseReportOrderService], (service: DatabaseReportOrderService) => {
    expect(service).toBeTruthy();
  }));
});
