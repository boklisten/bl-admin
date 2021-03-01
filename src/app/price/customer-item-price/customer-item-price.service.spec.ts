import { TestBed, inject } from "@angular/core/testing";

import { CustomerItemPriceService } from "./customer-item-price.service";

describe("CustomerItemPriceService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CustomerItemPriceService],
		});
	});

	it("should be created", inject(
		[CustomerItemPriceService],
		(service: CustomerItemPriceService) => {
			expect(service).toBeTruthy();
		}
	));
});
