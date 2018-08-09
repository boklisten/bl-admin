import {Injectable} from '@angular/core';
import {OrderService} from '@wizardcoder/bl-connect';
import {Order} from '@wizardcoder/bl-model';

@Injectable({
	providedIn: 'root'
})
export class OrderManagerListService {

	constructor(private _orderService: OrderService) {
	}

	public getPlacedOrders(): Promise<Order[]> {
		return this._orderService.getAll('?placed=true').then((orders: Order[]) => {
			return this.filterOrders(orders);
		}).catch((err) => {
			throw new Error('could not get get placed orders: ' + err);
		});
	}


	private filterOrders(orders: Order[]): Order[] {
		return orders.filter((order) => {
			if (!order.byCustomer) {
				return false;
			}

			for (const orderItem of order.orderItems) {
				if (orderItem.type !== 'extend' && orderItem.type !== 'buyout') {
					return true;
				}
			}
			return false;
		});
	}
}
