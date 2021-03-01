import { TestBed } from "@angular/core/testing";

import { UniqueItemStoreService } from "./unique-item-store.service";

describe("UniqueItemStoreService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: UniqueItemStoreService = TestBed.inject(
			UniqueItemStoreService
		);
		expect(service).toBeTruthy();
	});
});
