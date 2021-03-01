import { TestBed } from "@angular/core/testing";

import { InvoiceVismaService } from "./invoice-visma.service";

describe("InvoiceVismaService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: InvoiceVismaService = TestBed.inject(
			InvoiceVismaService
		);
		expect(service).toBeTruthy();
	});
});
