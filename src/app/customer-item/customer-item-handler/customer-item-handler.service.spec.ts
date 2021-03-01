import { TestBed, inject } from "@angular/core/testing";

import { CustomerItemHandlerService } from "./customer-item-handler.service";

describe("CustomerItemHandlerService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CustomerItemHandlerService],
		});
	});

	it("should be created", inject(
		[CustomerItemHandlerService],
		(service: CustomerItemHandlerService) => {
			expect(service).toBeTruthy();
		}
	));
});
