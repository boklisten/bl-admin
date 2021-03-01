import { TestBed } from "@angular/core/testing";

import { BlcArrowUpService } from "./blc-arrow-up.service";

describe("BlcArrowUpService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: BlcArrowUpService = TestBed.inject(BlcArrowUpService);
		expect(service).toBeTruthy();
	});
});
