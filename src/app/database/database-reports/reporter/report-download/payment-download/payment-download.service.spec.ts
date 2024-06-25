import { TestBed } from "@angular/core/testing";
import { PaymentService } from "@boklisten/bl-connect";
import { ExcelService } from "../../excel/excel.service";

import { PaymentDownloadService } from "./payment-download.service";

describe("PaymentDownloadService", () => {
	let paymentServiceSpy: jasmine.SpyObj<PaymentService>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: PaymentService,
					useValue: jasmine.createSpyObj("PaymentService", ["get"]),
				},
				{
					provide: ExcelService,
					useValue: jasmine.createSpyObj("ExcelService", [
						"objectsToExcelFile",
					]),
				},
			],
		});
	});

	beforeEach(() => {
		paymentServiceSpy = TestBed.inject(PaymentService);
	});

	it("should be created", () => {
		const service: PaymentDownloadService = TestBed.inject(
			PaymentDownloadService
		);
		expect(service).toBeTruthy();
	});

	describe("#getPaymentsByFilter", () => {
		it("should return all payments if no filter is provided", (done) => {
			const payments: any = [
				{
					id: "payment1",
					method: "dibs",
					amount: 100,
				},
				{
					id: "payment2",
					method: "card",
					amount: 100,
				},
			];

			const service: PaymentDownloadService = TestBed.inject(
				PaymentDownloadService
			);

			paymentServiceSpy.get.and.returnValues(payments);

			service.getPaymentsByFilter({}).then((returnedValue) => {
				expect(returnedValue).toEqual(payments);
				done();
			});
		});

		describe("when filter is provided", () => {
			it("should return payments when returned from api", (done) => {
				const payments: any = [
					{
						id: "payment1",
						method: "dibs",
						amount: 100,
					},
					{
						id: "payment2",
						method: "card",
						amount: 100,
					},
				];

				const filter = {
					branchIds: ["branchId"],
				};

				const paymentDownloadService = TestBed.inject(
					PaymentDownloadService
				);

				paymentServiceSpy.get.and.returnValue(payments);

				paymentDownloadService
					.getPaymentsByFilter(filter)
					.then((downloadedPayments) => {
						expect(downloadedPayments).toEqual(payments);
						done();
					});
			});

			describe('when "branchId" is present in filter', () => {
				it("should have branchId present in query", (done) => {
					const payments: any = [
						{
							id: "payment1",
							method: "dibs",
							amount: 100,
						},
					];

					paymentServiceSpy.get.and.returnValue(payments);

					const service: PaymentDownloadService = TestBed.inject(
						PaymentDownloadService
					);

					const filter = {
						branchIds: ["branch1"],
					};

					service.getPaymentsByFilter(filter).then(() => {
						let args = paymentServiceSpy.get.calls.mostRecent()
							.args;

						expect(args[0]).toContain("branch=branch1");

						done();
					});
				});

				it("should have all branchIds from filter present in query", (done) => {
					paymentServiceSpy.get.and.returnValue([]);

					const service: PaymentDownloadService = TestBed.inject(
						PaymentDownloadService
					);

					const filter = {
						branchIds: ["branch1", "branch2", "branch3", "branch4"],
					};

					service.getPaymentsByFilter(filter).then(() => {
						let args = paymentServiceSpy.get.calls.mostRecent()
							.args;

						expect(args[0]).toContain("branch=branch1");
						expect(args[0]).toContain("branch=branch2");
						expect(args[0]).toContain("branch=branch3");
						expect(args[0]).toContain("branch=branch4");

						done();
					});
				});
			});

			describe('when "fromDate" and "toDate" is present in filter', () => {
				it("should have fromDate and toDate present in query", (done) => {
					const payments: any = [
						{
							id: "payment1",
							method: "dibs",
							amount: 100,
						},
					];

					paymentServiceSpy.get.and.returnValue(payments);

					const service: PaymentDownloadService = TestBed.inject(
						PaymentDownloadService
					);

					const filter = {
						fromDate: new Date(2000, 0, 1),
						toDate: new Date(2001, 0, 1),
					};

					service.getPaymentsByFilter(filter).then(() => {
						let args = paymentServiceSpy.get.calls.mostRecent()
							.args;

						expect(args[0]).toContain("creationTime=>010120000000");
						expect(args[0]).toContain("creationTime=<010120010000");

						done();
					});
				});
			});

			describe("when methods is present in filter", () => {
				it('should have method "cash" in query when in filter', (done) => {
					const filter = {
						methods: ["cash"],
					};

					const service = TestBed.inject(PaymentDownloadService);
					paymentServiceSpy.get.and.returnValue([]);

					service.getPaymentsByFilter(filter).then(() => {
						const args = paymentServiceSpy.get.calls.mostRecent()
							.args;

						expect(args[0]).toContain("method=cash");
						done();
					});
				});

				it("should all methods in query present in filter", (done) => {
					const filter = {
						methods: ["cash", "card", "dibs"],
					};

					const service = TestBed.inject(PaymentDownloadService);
					paymentServiceSpy.get.and.returnValue([]);

					service.getPaymentsByFilter(filter).then(() => {
						const args = paymentServiceSpy.get.calls.mostRecent()
							.args;

						expect(args[0]).toContain("method=cash");
						expect(args[0]).toContain("method=card");
						expect(args[0]).toContain("method=dibs");
						done();
					});
				});
			});
		});
	});
});
