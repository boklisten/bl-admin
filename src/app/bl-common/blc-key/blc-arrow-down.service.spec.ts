import { TestBed } from "@angular/core/testing";

import { BlcArrowDownService } from "./blc-arrow-down.service";

describe("BlcArrowDownService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: BlcArrowDownService = TestBed.inject(
			BlcArrowDownService
		);
		expect(service).toBeTruthy();
	});
});
