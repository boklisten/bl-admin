import { TestBed, inject } from "@angular/core/testing";

import { CartConfirmService } from "./cart-confirm.service";

describe("CartConfirmService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CartConfirmService],
		});
	});

	it("should be created", inject(
		[CartConfirmService],
		(service: CartConfirmService) => {
			expect(service).toBeTruthy();
		}
	));
});
