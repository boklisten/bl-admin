import { TestBed, inject } from "@angular/core/testing";

import { DatabaseExcelService } from "./database-excel.service";

describe("DatabaseExcelService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DatabaseExcelService],
		});
	});

	it("should be created", inject(
		[DatabaseExcelService],
		(service: DatabaseExcelService) => {
			expect(service).toBeTruthy();
		}
	));
});
