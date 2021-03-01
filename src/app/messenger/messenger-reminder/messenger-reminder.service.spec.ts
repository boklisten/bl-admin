import { TestBed } from "@angular/core/testing";

import { MessengerReminderService } from "./messenger-reminder.service";

describe("MessengerReminderService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: MessengerReminderService = TestBed.inject(
			MessengerReminderService
		);
		expect(service).toBeTruthy();
	});
});
