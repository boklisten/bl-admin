import { TestBed, fakeAsync, tick } from "@angular/core/testing";

import { OrderDownloadService } from "./order-download.service";
import { OrderService, UserDetailService } from "@boklisten/bl-connect";
import { ExcelService } from "./../../excel/excel.service";
import { Injectable } from "@angular/core";
import { Order } from "@boklisten/bl-model";

@Injectable()
class UserDetailStubService {}

describe("OrderDownloadService", () => {
	let excelServiceSpy: jasmine.SpyObj<ExcelService>;
	let orderServiceSpy: jasmine.SpyObj<OrderService>;
	let orderDownloadService: OrderDownloadService;

	beforeEach(() => {
		const excelSpy = jasmine.createSpyObj("ExcelService", [
			"objectsToExcelFile",
		]);
		const orderSpy = jasmine.createSpyObj("OrderService", ["getAll"]);

		TestBed.configureTestingModule({
			providers: [
				{ provide: OrderService, useValue: orderSpy },
				{ provide: UserDetailService, useClass: UserDetailStubService },
				{ provide: ExcelService, useValue: excelServiceSpy },
			],
		});
	});

	beforeEach(() => {
		excelServiceSpy = TestBed.inject(ExcelService);
		orderServiceSpy = TestBed.inject(OrderService);
	});

	it("should be created", () => {
		const service: OrderDownloadService = TestBed.inject(
			OrderDownloadService
		);
		expect(service).toBeTruthy();
	});

	it("should call api with correct query based on filter", (done) => {
		const service: OrderDownloadService = TestBed.inject(
			OrderDownloadService
		);

		const filter = {
			branchId: "branch1",
			fromDate: new Date(2000, 0, 1),
			toDate: new Date(2001, 0, 1),
			byCustomer: true,
		};

		const orders: Order[] = [{ id: "1", byCustomer: true }] as Order[];

		orderServiceSpy.getAll.and.returnValue(orders);

		service.getOrdersByFilter(filter).then((returnedOrders) => {
			let args = orderServiceSpy.getAll.calls.mostRecent().args;

			expect(args[0]).toContain("creationTime=>010120000000");

			expect(args[0]).toContain("creationTime=<010120010000");

			expect(args[0]).toContain("byCustomer=true");

			expect(args[0]).toContain("placed=true");

			done();
		});
	});

	it("should call api with correct query if orderItemNotDelivered flag is set in filter", (done) => {
		const service: OrderDownloadService = TestBed.inject(
			OrderDownloadService
		);

		const filter = {
			orderItemNotHandedOut: true,
		};

		const orders: Order[] = [{ id: "1", byCustomer: true }] as Order[];

		orderServiceSpy.getAll.and.returnValue(orders);

		service.getOrdersByFilter(filter).then((returnedOrders) => {
			let args = orderServiceSpy.getAll.calls.mostRecent().args;

			expect(args[0].indexOf("orderItems.handout") > -1).toBeFalsy();

			expect(args[0].indexOf("orderItems.delivered") > -1).toBeFalsy();

			done();
		});
	});

	describe("#filterOrderItems", () => {
		it("should only include orderItems with type defined by filter", () => {
			const order = {
				id: "order1",
				orderItems: [
					{
						id: "orderItem1",
						type: "buy",
						title: "some title",
					},
					{
						id: "orderItem1",
						type: "rent",
						title: "some title",
					},
					{
						id: "orderItem1",
						type: "sell",
						title: "some title",
					},
				],
			};

			const filter = {
				includedOrderItemTypes: ["rent", "buy"],
			};

			const service = TestBed.inject(OrderDownloadService);

			let expectedOutput = []; // this should only include items wiht buy or sell
			expectedOutput.push(order.orderItems[0]); // this has type buy
			expectedOutput.push(order.orderItems[1]); // this has type rent

			expect(service.filterOrderItems(filter, order)).toEqual(
				expectedOutput
			);
		});

		describe("when filter flag orderItemNotHandedOut is set", () => {
			it("should not include orderItems with movedToOrder", () => {
				const service = TestBed.inject(OrderDownloadService);
				const order = {
					id: "",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Some Title",
							handout: true,
							customerItem: "",
							movedToOrder: "movedToOrder1",
							movedFromOrder: "",
						},
						{
							type: "rent",
							item: "item1",
							title: "another title",
							movedToOrder: "movedToOrder2",
							customerItem: "",
						},
					],
				};

				const filter = {
					orderItemNotHandedOut: true,
				};

				expect(
					service.filterOrderItems(filter, order as Order)
				).toEqual([]);
			});

			it("should not include orderItems with customerItem", () => {
				const service = TestBed.inject(OrderDownloadService);
				const order = {
					id: "",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Some Title",
							handout: true,
							customerItem: "customerItem1",
						},
						{
							type: "rent",
							item: "item1",
							title: "another title",
							customerItem: "customerItem2",
						},
					],
				};

				const filter = {
					orderItemNotHandedOut: true,
				};

				expect(
					service.filterOrderItems(filter, order as Order)
				).toEqual([]);
			});

			it("should not include orderItems with handout set to true", () => {
				const service = TestBed.inject(OrderDownloadService);
				const order = {
					id: "",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Some Title",
							handout: true,
						},
						{
							type: "rent",
							item: "item1",
							title: "another title",
							handout: true,
						},
					],
				};

				const filter = {
					orderItemNotHandedOut: true,
				};

				expect(
					service.filterOrderItems(filter, order as Order)
				).toEqual([]);
			});

			it("should not include orderItems with delivered set to true", () => {
				const service = TestBed.inject(OrderDownloadService);
				const order = {
					id: "",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Some Title",
							delivered: true,
						},
						{
							type: "rent",
							item: "item1",
							title: "another title",
							delivered: true,
						},
					],
				};

				const filter = {
					orderItemNotHandedOut: true,
				};

				expect(
					service.filterOrderItems(filter, order as Order)
				).toEqual([]);
			});

			it("should include orderItems that are not handed out", () => {
				const service = TestBed.inject(OrderDownloadService);
				const order = {
					id: "",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Some Title",
						},
						{
							type: "rent",
							item: "item2",
							title: "another title",
						},
					],
				};

				const filter = {
					orderItemNotHandedOut: true,
				};

				expect(
					service.filterOrderItems(filter, order as Order)
				).toEqual(order.orderItems);
			});
		});
	});

	describe("#filterOrders", () => {
		it("should only include orders and orderItems that match the filter", () => {
			const orders = [
				{
					id: "order1",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Some Title",
							customerItem: "customerItem1",
						},
						{
							type: "rent",
							item: "item2",
							title: "another title",
							customerItem: "customerItem2",
						},
					],
				},
				{
					id: "order2",
					orderItems: [
						{
							type: "rent",
							item: "item1",
							title: "Hitch",
						},
						{
							type: "rent",
							item: "item2",
							title: "another title",
							customerItem: "customerItem2",
						},
					],
				},
			];

			const service = TestBed.inject(OrderDownloadService);

			const filter = {
				orderItemNotHandedOut: true,
			};

			let expectedOutput = [
				{
					id: orders[1].id,
					orderItems: [orders[1].orderItems[0]],
				},
			];

			expect(service.filterOrders(filter, orders)).toEqual(
				expectedOutput
			);
		});
	});
});
