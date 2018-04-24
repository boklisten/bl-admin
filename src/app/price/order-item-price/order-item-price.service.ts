import {Injectable} from '@angular/core';
import {Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {ItemPriceService} from '../item-price/item-price.service';

@Injectable()
export class OrderItemPriceService {

	constructor(private _itemPriceService: ItemPriceService) {
	}

	public orderItemTypePayedFor(orderItem: OrderItem, order: Order): boolean {
		if (!order || !order.payments || order.payments.length <= 0) {
			return false;
		}

		for (const customerOrderItem of order.orderItems) {
			if (customerOrderItem.item === orderItem.item) {
				if (customerOrderItem.type === orderItem.type) {
					if (orderItem.type === 'rent' || orderItem.type === 'extend') {
						if (customerOrderItem.info.periodType !== orderItem.info.periodType) {
							return false;
						}
					}

					return true;
				}
			}
		}

		return false;
	}

	public orderItemAmountPayed(orderItem: OrderItem, order: Order): number {
		if (!order.payments || order.payments.length <= 0) {
			return 0;
		}

		for (const customerOrderItem of order.orderItems) {
			if (customerOrderItem.item === orderItem.item) {
				return customerOrderItem.amount;
			}
		}

		return 0;
	}

	public calculateOrderItemPrice(orderItem: OrderItem, item: Item, order?: Order, alreadyPayed?: number): number {
		if (this.orderItemTypePayedFor(orderItem, order)) {
			return 0;
		}

		switch (orderItem.type as any) {
			case 'rent':
				return this._itemPriceService.rentPrice(item, orderItem.info.periodType, orderItem.info.numberOfPeriods, alreadyPayed);
			case 'buy':
				return this._itemPriceService.buyPrice(item, alreadyPayed);
			case 'sell':
				return this._itemPriceService.sellPrice(item);
			case 'cancel':
				return 0 - alreadyPayed;
			default:
				return 0;
		}
	}

}
