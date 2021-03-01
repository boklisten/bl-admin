import { TestBed } from "@angular/core/testing";

import { PaymentHelperService } from "./payment-helper.service";

describe("PaymentHelperService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: PaymentHelperService = TestBed.inject(
			PaymentHelperService
		);
		expect(service).toBeTruthy();
	});
});
