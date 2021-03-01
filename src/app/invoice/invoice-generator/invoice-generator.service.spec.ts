import { TestBed } from "@angular/core/testing";

import { InvoiceGeneratorService } from "./invoice-generator.service";

describe("InvoiceGeneratorService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: InvoiceGeneratorService = TestBed.inject(
			InvoiceGeneratorService
		);
		expect(service).toBeTruthy();
	});
});
