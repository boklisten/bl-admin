import { TestBed } from "@angular/core/testing";

import { BookingCreateService } from "./booking-create.service";

describe("BookingCreateService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: BookingCreateService = TestBed.inject(
			BookingCreateService
		);
		expect(service).toBeTruthy();
	});
});
