import { TestBed, inject } from "@angular/core/testing";

import { BlcKeyeventDoubleShiftService } from "./blc-keyevent-double-shift.service";

describe("BlcKeyeventDoubleShiftService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BlcKeyeventDoubleShiftService],
		});
	});

	it("should be created", inject(
		[BlcKeyeventDoubleShiftService],
		(service: BlcKeyeventDoubleShiftService) => {
			expect(service).toBeTruthy();
		}
	));
});
