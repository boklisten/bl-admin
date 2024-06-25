import { TestBed } from "@angular/core/testing";
import { ExcelService } from "../../excel/excel.service";
import { CustomerItemService } from "@boklisten/bl-connect";
import { DateService } from "../../../bl-common/date/date.service";
import { CustomerItemFilter } from "./customerItemFilter";

import { CustomerItemDownloadService } from "./customer-item-download.service";

describe("CustomerItemDownloadService", () => {
	let excelServiceSpy: jasmine.SpyObj<ExcelService>;
	let customerItemServiceSpy: jasmine.SpyObj<CustomerItemService>;
	let service: CustomerItemDownloadService;

	beforeEach(() => {
		const excelServiceSpy = jasmine.createSpyObj("ExcelService", [
			"objectsToExcelFile",
		]);
		const customerItemServiceSpy = jasmine.createSpyObj(
			"CustomerItemService",
			["get"]
		);

		TestBed.configureTestingModule({
			providers: [
				{ provide: ExcelService, useValue: excelServiceSpy },
				{
					provide: CustomerItemService,
					useValue: customerItemServiceSpy,
				},
				DateService,
			],
		});
	});

	beforeEach(() => {
		excelServiceSpy = TestBed.inject(ExcelService);
		customerItemServiceSpy = TestBed.inject(CustomerItemService);
		service = TestBed.inject(CustomerItemDownloadService);
	});

	it("should be created", () => {
		const service: CustomerItemDownloadService = TestBed.inject(
			CustomerItemDownloadService
		);
		expect(service).toBeTruthy();
	});

	describe("#getCustomerItemsByFilter", () => {
		describe("when branchIds are present in filter", () => {
			it("should have branchId in query to API", (done) => {
				const filter = {
					branchIds: ["branch1"],
				};

				customerItemServiceSpy.get.and.returnValue([]);

				service.getCustomerItemsByFilter(filter).then(() => {
					const args = customerItemServiceSpy.get.calls.mostRecent()
						.args;

					expect(args[0]).toContain("branch=branch1");

					done();
				});
			});

			it("should have all branchIds in query to API", (done) => {
				const filter = {
					branchIds: ["branch1", "branch2", "branch3"],
				};

				customerItemServiceSpy.get.and.returnValue([]);

				service.getCustomerItemsByFilter(filter).then(() => {
					const args = customerItemServiceSpy.get.calls.mostRecent()
						.args;

					expect(args[0]).toContain("branch=branch1");
					expect(args[0]).toContain("branch=branch2");
					expect(args[0]).toContain("branch=branch3");

					done();
				});
			});
		});

		describe('when "returned" is set in filter', () => {
			it('should have "returned" in query', (done) => {
				const filter = {
					returned: true,
				};

				customerItemServiceSpy.get.and.returnValue([]);

				service.getCustomerItemsByFilter(filter).then(() => {
					const args = customerItemServiceSpy.get.calls.mostRecent()
						.args;

					expect(args[0]).toContain("returned=true");
					done();
				});
			});
		});

		describe('when "buyout" is set in filter', () => {
			it('should have "buyout" in set to "true" query', (done) => {
				const filter = {
					buyout: true,
				};

				customerItemServiceSpy.get.and.returnValue([]);

				service.getCustomerItemsByFilter(filter).then(() => {
					const args = customerItemServiceSpy.get.calls.mostRecent()
						.args;

					expect(args[0]).toContain("buyout=true");
					done();
				});
			});

			it('should have "buyout" in set to "false" query', (done) => {
				const filter = {
					buyout: false,
				};

				customerItemServiceSpy.get.and.returnValue([]);

				service.getCustomerItemsByFilter(filter).then(() => {
					const args = customerItemServiceSpy.get.calls.mostRecent()
						.args;

					expect(args[0]).toContain("buyout=false");
					done();
				});
			});
		});

		describe('when "fromDate" and "toDate" is present in filter', () => {
			it('should have "fromDate" and "toDate" present in filter', (done) => {
				const filter: CustomerItemFilter = {
					fromDate: new Date(2010, 0, 1),
					toDate: new Date(2011, 0, 1),
				};

				customerItemServiceSpy.get.and.returnValue([]);

				service.getCustomerItemsByFilter(filter).then(() => {
					const args = customerItemServiceSpy.get.calls.mostRecent()
						.args;

					expect(args[0]).toContain("creationTime=>010120100000");
					expect(args[0]).toContain("creationTime=<010120110000");
					done();
				});
			});
		});

		it('should not include "returned" in query when not in filter', (done) => {
			const filter = {
				branchIds: ["branch1"],
			};

			customerItemServiceSpy.get.and.returnValue([]);

			service.getCustomerItemsByFilter(filter).then(() => {
				const args = customerItemServiceSpy.get.calls.mostRecent().args;

				expect(args[0]).not.toContain("returned");

				done();
			});
		});

		it('should not include "fromDate" or "toDate" in query when not in filter', (done) => {
			const filter = {
				branchIds: ["branch1"],
			};

			customerItemServiceSpy.get.and.returnValue([]);

			service.getCustomerItemsByFilter(filter).then(() => {
				const args = customerItemServiceSpy.get.calls.mostRecent().args;

				expect(args[0]).not.toContain("creationTime");

				done();
			});
		});

		it("should not include barnchId in query when not in filter", (done) => {
			const filter = {};

			customerItemServiceSpy.get.and.returnValue([]);

			service.getCustomerItemsByFilter(filter).then(() => {
				const args = customerItemServiceSpy.get.calls.mostRecent().args;

				expect(args[0]).not.toContain("branch");

				done();
			});
		});
	});
});
