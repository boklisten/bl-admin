import { Injectable } from "@angular/core";
import { OrderService, UserDetailService } from "@boklisten/bl-connect";
import { Order, OrderItem } from "@boklisten/bl-model";
import { ExcelService } from "../../excel/excel.service";
import { DatabaseReportOrderFilter } from "./databaseReportOrderFilter";

import moment from "moment-es6";

@Injectable({
	providedIn: "root",
})
export class OrderDownloadService {
	private _dateFormat: string;

	constructor(
		private _orderService: OrderService,
		private _userDetailService: UserDetailService,
		private _databaseExcelService: ExcelService
	) {
		this._dateFormat = "DDMMYYYYHHmm";
	}

	public async getOrdersByFilter(
		filter: DatabaseReportOrderFilter
	): Promise<Order[]> {
		const query = this.buildQuerySting(filter);
		return this._orderService.get({ query: query });
	}

	public filterOrders(
		filter: DatabaseReportOrderFilter,
		orders: Order[]
	): Order[] {
		let filteredOrders: Order[] = [];
		for (let order of orders) {
			let filteredOrderItems = this.filterOrderItems(filter, order);

			if (filteredOrderItems.length > 0) {
				order.orderItems = filteredOrderItems;
				filteredOrders.push(order);
			}
		}

		return filteredOrders;
	}

	public filterOrderItems(
		filter: DatabaseReportOrderFilter,
		order: Order
	): OrderItem[] {
		const filteredOrderItems: OrderItem[] = [];

		for (const orderItem of order.orderItems) {
			if (filter.orderItemNotHandedOut) {
				if (typeof orderItem.movedToOrder !== "undefined") {
					continue;
				}

				if (typeof orderItem.customerItem !== "undefined") {
					continue;
				}

				if (
					typeof orderItem.handout !== "undefined" &&
					orderItem.handout
				) {
					continue;
				}

				if (
					typeof orderItem.delivered !== "undefined" &&
					orderItem.delivered
				) {
					continue;
				}
			}

			if (
				typeof filter.includedOrderItemTypes !== "undefined" &&
				filter.includedOrderItemTypes.length > 0
			) {
				if (
					filter.includedOrderItemTypes.indexOf(orderItem.type) <= -1
				) {
					continue;
				}
			}

			filteredOrderItems.push(orderItem);
		}

		return filteredOrderItems;
	}

	public async printFilteredOrdersToFile(
		filter: DatabaseReportOrderFilter
	): Promise<boolean> {
		try {
			const orders = await this.getOrdersByFilter(filter);
			const filteredOrders = this.filterOrders(filter, orders);

			if (filteredOrders.length <= 0) {
				throw new Error(
					"OrderDownloadService: no orders found matching the filter"
				);
			}

			await this.printOrdersToExcel(filter, filteredOrders);

			return true;
		} catch (e) {
			throw e;
		}
	}

	private async printOrdersToExcel(
		filter: DatabaseReportOrderFilter,
		orders: Order[]
	): Promise<boolean> {
		let allExcelObjects: any[] = [];

		for (const order of orders) {
			const excelObjects = await this.orderToExcelObjects(order, filter);
			allExcelObjects = allExcelObjects.concat(excelObjects);
		}

		this._databaseExcelService.objectsToExcelFile(
			allExcelObjects,
			"orders"
		);

		return true;
	}

	private async orderToExcelObjects(
		order: Order,
		filter: DatabaseReportOrderFilter
	): Promise<any[]> {
		const excelObjects: any[] = [];

		for (const orderItem of order.orderItems) {
			excelObjects.push({
				orderId: order.id,
				branchId: order.branch,
				orderMadeBy: order.byCustomer ? "customer" : "branch",
				employee: order.employee ?? null,
				customerId: order.customer,
				title: orderItem.title,
				amount: orderItem.amount,
				taxAmount: orderItem.taxAmount,
				deliveryId: order.delivery,
				type: orderItem.type,
				payed: order.payments && order.payments.length > 0 ? 1 : 0,
				movedToOrder: orderItem.movedToOrder,
				creationTime: order.creationTime,
				pivot: 1, // used for excel pivot table
			});
		}
		return excelObjects;
	}

	private buildQuerySting(filter: DatabaseReportOrderFilter): string {
		let query = "?placed=true";

		if (filter.branchId) {
			query += "&branch=" + filter.branchId;
		}

		if (filter.fromDate) {
			const fromDate = this.getDateString(filter.fromDate);

			if (filter.fromDate && filter.toDate) {
				const toDate = this.getDateString(filter.toDate);

				query += "&creationTime=>" + fromDate;
				query += "&creationTime=<" + toDate;
			} else {
				query += "&creationTime=" + fromDate;
			}
		}

		if (filter.byCustomer) {
			query += "&byCustomer=" + filter.byCustomer;
		}

		if (
			typeof filter.orderItemNotHandedOut == "undefined" &&
			filter.orderItemNotHandedOut == true
		) {
			//query += '&orderItems.handout=false';
			//query += '&orderItems.delivered=false';
		}

		return query;
	}

	private getDateString(date: Date): string {
		return moment(date)
			.set("hours", 0)
			.set("minutes", 0)
			.format(this._dateFormat);
	}
}
