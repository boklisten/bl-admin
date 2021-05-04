import { TestBed } from "@angular/core/testing";

import { BulkCollectionService } from "./bulk-collection.service";

describe("BulkCollectionService", () => {
	let service: BulkCollectionService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BulkCollectionService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
