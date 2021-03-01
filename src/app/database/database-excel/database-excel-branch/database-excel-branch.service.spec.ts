import { TestBed, inject } from "@angular/core/testing";

import { DatabaseExcelBranchService } from "./database-excel-branch.service";

describe("DatabaseExcelBranchService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DatabaseExcelBranchService],
		});
	});

	it("should be created", inject(
		[DatabaseExcelBranchService],
		(service: DatabaseExcelBranchService) => {
			expect(service).toBeTruthy();
		}
	));
});
