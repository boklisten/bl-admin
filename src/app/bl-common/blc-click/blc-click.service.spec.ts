import { TestBed } from "@angular/core/testing";

import { BlcClickService } from "./blc-click.service";

describe("BlcClickService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: BlcClickService = TestBed.inject(BlcClickService);
		expect(service).toBeTruthy();
	});
});
