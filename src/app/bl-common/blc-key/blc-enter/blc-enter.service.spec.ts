import { TestBed } from "@angular/core/testing";

import { BlcEnterService } from "./blc-enter.service";

describe("BlcEnterService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: BlcEnterService = TestBed.inject(BlcEnterService);
		expect(service).toBeTruthy();
	});
});
