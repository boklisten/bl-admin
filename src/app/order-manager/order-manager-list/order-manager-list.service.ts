import { Injectable } from "@angular/core";
import { DeliveryService, OrderService } from "@wizardcoder/bl-connect";
import { Order } from "@wizardcoder/bl-model";
import * as moment from "moment";
import { BranchStoreService } from "../../branch/branch-store.service";

export interface OrderFilter {
	placed: boolean; // if the order should be placed or not
	byCustomer: boolean; // only show orders by customers
	atBranch?: boolean; // only show orders done at branch
	processed?: boolean; // orderItems with "movedToOrder" is considered processed
	from?: Date;
	to?: Date;
	delivery?: boolean; // show only orders that have delivery
	payment?: boolean; // show only orders with confirmed payment
	noPayment?: boolean; // show only orders with NO payment
	onlyCurrentBranch: boolean;
	autoFetch: boolean; // if set the orders are updated each 30 sec
}

@Injectable({
	providedIn: "root"
})
export class OrderManagerListService {
	private fetching: boolean;
	private orderFilter: OrderFilter;

	constructor(
		private _orderService: OrderService,
		private _deliveryService: DeliveryService,
		private _branchStoreService: BranchStoreService
	) {
		this.orderFilter = this.getDefaultOrderFilter();
		this.fetching = true;
	}

	public async getPlacedOrders(): Promise<Order[]> {
		try {
			const orders = await this._orderService.get({
				query: this.getOrderQueryBasedOnFilter(this.orderFilter)
			});
			return await this.filterOrders(orders);
		} catch (e) {
			throw new Error("OrderManagerListService: could not get orders");
		}
	}

	public setFilter(orderFilter: OrderFilter) {
		this.orderFilter = orderFilter;
	}

	public getOrderFilter(): OrderFilter {
		return this.orderFilter;
	}

	private async filterOrders(orders: Order[]): Promise<Order[]> {
		const returnOrders: Order[] = [];

		for (const order of orders) {
			if (this.orderFilter.delivery) {
				if (
					!order.delivery ||
					(typeof order.delivery === "string" &&
						order.delivery.length <= 0)
				) {
					continue;
				}
				const delivery = await this._deliveryService.getById(
					order.delivery as string
				);

				if (delivery.method !== "bring") {
					continue;
				}
			}

			let shouldInclude = false;

			for (const orderItem of order.orderItems) {
				if (
					orderItem.type !== "extend" &&
					orderItem.type !== "buyout" &&
					!orderItem.movedToOrder
				) {
					shouldInclude = true;
				}
			}

			if (shouldInclude) {
				returnOrders.push(order);
			}
		}
		return returnOrders;
	}

	private getDefaultOrderFilter(): OrderFilter {
		return {
			placed: true,
			byCustomer: true,
			processed: false,
			from: moment()
				.subtract("1", "week")
				.toDate(),
			to: new Date(),
			delivery: false,
			payment: false,
			onlyCurrentBranch: true,
			autoFetch: false
		};
	}

	private getOrderQueryBasedOnFilter(orderFilter: OrderFilter): string {
		let query = "?";

		if (orderFilter.placed) {
			query += "placed=true";
		} else {
			query += "placed=false";
		}

		if (orderFilter.onlyCurrentBranch) {
			query +=
				"&branch=" + this._branchStoreService.getCurrentBranch().id;
		}

		if (orderFilter.byCustomer) {
			query += "&byCustomer=true";
		}

		return query;
	}
}
