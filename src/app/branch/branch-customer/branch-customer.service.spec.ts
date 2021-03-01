import { TestBed } from "@angular/core/testing";

import { BranchCustomerService } from "./branch-customer.service";

describe("BranchCustomerService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: BranchCustomerService = TestBed.inject(
			BranchCustomerService
		);
		expect(service).toBeTruthy();
	});
});
