import { TestBed } from "@angular/core/testing";

import { OrderGeneratorService } from "./order-generator.service";

describe("OrderGeneratorService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: OrderGeneratorService = TestBed.inject(
			OrderGeneratorService
		);
		expect(service).toBeTruthy();
	});
});
