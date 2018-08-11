import {Injectable} from '@angular/core';
import {OrderService} from '@wizardcoder/bl-connect';
import {Order} from '@wizardcoder/bl-model';
import * as moment from 'moment';

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
}

@Injectable({
	providedIn: 'root'
})
export class OrderManagerListService {

	private orderFilter: OrderFilter;

	constructor(private _orderService: OrderService) {
		this.orderFilter = this.getDefaultOrderFilter();
	}

	public getPlacedOrders(): Promise<Order[]> {
		return this._orderService.getAll(this.getOrderQueryBasedOnFilter(this.orderFilter)).then((orders: Order[]) => {
			return this.filterOrders(orders);
		}).catch((err) => {
			throw new Error('could not get get placed orders: ' + err);
		});
	}


	private filterOrders(orders: Order[]): Order[] {
		return orders.filter((order) => {

			for (const orderItem of order.orderItems) {
				if (orderItem.type !== 'extend' && orderItem.type !== 'buyout' && !orderItem.movedToOrder) {
					return true;
				}
			}
			return false;
		});
	}

	public getOrderFilter(): OrderFilter {
		return this.orderFilter;
	}

	private getDefaultOrderFilter(): OrderFilter {
		return {
			placed: true,
			byCustomer: true,
			processed: false,
			from: moment().subtract('1', 'week').toDate(),
			to: new Date(),
			delivery: false,
			payment: false
		};
	}


	private getOrderQueryBasedOnFilter(orderFilter: OrderFilter): string {
		let query = '?';

		if (orderFilter.placed) {
			query += 'placed=true';
		} else {
			query += 'placed=false';
		}

		if (orderFilter.byCustomer) {
			query += '&byCustomer=true';
		}

		return query;
	}

}
