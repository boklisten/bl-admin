import { TestBed } from "@angular/core/testing";

import { InvoiceCreateService } from "./invoice-create.service";

describe("InvoiceCreateService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: InvoiceCreateService = TestBed.inject(
			InvoiceCreateService
		);
		expect(service).toBeTruthy();
	});
});
