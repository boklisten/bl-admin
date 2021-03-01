import { TestBed, inject } from "@angular/core/testing";

import { ItemSearchService } from "./item-search.service";

describe("ItemSearchService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ItemSearchService],
		});
	});

	it("should be created", inject(
		[ItemSearchService],
		(service: ItemSearchService) => {
			expect(service).toBeTruthy();
		}
	));
});
