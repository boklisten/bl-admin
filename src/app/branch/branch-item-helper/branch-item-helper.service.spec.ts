import { TestBed, inject } from "@angular/core/testing";

import { BranchItemHelperService } from "./branch-item-helper.service";

describe("BranchItemHelperService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BranchItemHelperService],
		});
	});

	it("should be created", inject(
		[BranchItemHelperService],
		(service: BranchItemHelperService) => {
			expect(service).toBeTruthy();
		}
	));
});
