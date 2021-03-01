import { TestBed, inject } from "@angular/core/testing";

import { BranchItemCategorySelectService } from "./branch-item-category-select.service";

describe("BranchItemCategorySelectService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BranchItemCategorySelectService],
		});
	});

	it("should be created", inject(
		[BranchItemCategorySelectService],
		(service: BranchItemCategorySelectService) => {
			expect(service).toBeTruthy();
		}
	));
});
