import { TestBed, inject } from "@angular/core/testing";

import { OpeningHoursHandlerService } from "./opening-hours-handler.service";

describe("OpeningHoursHandlerService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [OpeningHoursHandlerService],
		});
	});

	it("should be created", inject(
		[OpeningHoursHandlerService],
		(service: OpeningHoursHandlerService) => {
			expect(service).toBeTruthy();
		}
	));
});
