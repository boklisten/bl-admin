import { TestBed } from "@angular/core/testing";

import { CartItemService } from "./cart-item.service";

describe("CartItemService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: CartItemService = TestBed.inject(CartItemService);
		expect(service).toBeTruthy();
	});
});
