import { TestBed } from "@angular/core/testing";

import { CartOrderService } from "./cart-order.service";

describe("CartOrderService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: CartOrderService = TestBed.inject(CartOrderService);
		expect(service).toBeTruthy();
	});
});
