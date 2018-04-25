import {Injectable} from '@angular/core';
import {Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {ItemPriceService} from '../item-price/item-price.service';

@Injectable()
export class OrderItemPriceService {

	constructor(private _itemPriceService: ItemPriceService) {
	}

	public orderItemTypePayedFor(orderItem: OrderItem, originalOrderItem: OrderItem, originalOrder: Order): boolean {
		if (!originalOrderItem || (!originalOrder.payments || originalOrder.payments.length <= 0)) {
			return false;
		}

		if (originalOrderItem.item === orderItem.item) {
			if (originalOrderItem.type === orderItem.type) {
				if (orderItem.type === 'rent' || orderItem.type === 'extend') {
					if (originalOrderItem.info.periodType !== orderItem.info.periodType) {
						return false;
					}
				}

				return true;
			}
		}

		return false;
	}

	public calculateOrderItemPrice(orderItem: OrderItem, item: Item, originalOrderItem?: OrderItem, originalOrder?: Order): number {
		if (originalOrderItem && this.orderItemTypePayedFor(orderItem, originalOrderItem, originalOrder)) {
			return 0;
		}


		const alreadyPayed = (originalOrderItem && (originalOrder.payments && originalOrder.payments.length > 0)) ? originalOrderItem.amount : 0;


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
