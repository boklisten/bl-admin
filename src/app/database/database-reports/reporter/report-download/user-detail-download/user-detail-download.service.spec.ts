import { TestBed } from "@angular/core/testing";

import { UserDetailDownloadService } from "./user-detail-download.service";

describe("UserDetailDownloadService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: UserDetailDownloadService = TestBed.inject(
			UserDetailDownloadService
		);
		expect(service).toBeTruthy();
	});
});
