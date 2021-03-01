import { TestBed, inject } from "@angular/core/testing";

import { OrderManagerListService } from "./order-manager-list.service";

describe("OrderManagerListService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [OrderManagerListService],
		});
	});

	it("should be created", inject(
		[OrderManagerListService],
		(service: OrderManagerListService) => {
			expect(service).toBeTruthy();
		}
	));
});
