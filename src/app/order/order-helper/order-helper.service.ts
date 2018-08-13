import {Injectable} from '@angular/core';
import {BlError, Order, OrderItem} from '@wizardcoder/bl-model';
import {OrderService} from '@wizardcoder/bl-connect';

@Injectable({
	providedIn: 'root'
})
export class OrderHelperService {

	constructor(private _orderService: OrderService) {
	}


	public async getMovedFromOrderAndOrderItem(orderItem: OrderItem): Promise<{movedFromOrder: Order, movedFromOrderItem: OrderItem}> {
		try {
            const movedFromOrder = await this._orderService.getById(orderItem.movedFromOrder);
            const movedFromOrderItem = this.getOrderItemFromOrder(orderItem.item, movedFromOrder);
            return {movedFromOrder: movedFromOrder, movedFromOrderItem: movedFromOrderItem};
		} catch (e) {
			throw e;
		}

	}

	private getOrderItemFromOrder(itemId: string, order: Order): OrderItem {

		for (const orderItem of order.orderItems) {
			if (orderItem.item.toString() === itemId.toString()) {
				return orderItem;
			}
		}

		throw new BlError('OrderHelperService: could not find orderItem in order');
	}
}
