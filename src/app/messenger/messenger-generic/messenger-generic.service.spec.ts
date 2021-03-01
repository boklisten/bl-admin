import { TestBed } from "@angular/core/testing";

import { MessengerGenericService } from "./messenger-generic.service";

describe("MessengerGenericService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: MessengerGenericService = TestBed.inject(
			MessengerGenericService
		);
		expect(service).toBeTruthy();
	});
});
