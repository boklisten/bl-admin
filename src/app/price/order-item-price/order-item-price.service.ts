import {Injectable} from '@angular/core';
import {Branch, CustomerItem, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {ItemPriceService} from '../item-price/item-price.service';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {BranchStoreService} from '../../branch/branch-store.service';

@Injectable()
export class OrderItemPriceService {

	constructor(private _itemPriceService: ItemPriceService) {
	}

	public priceRent(orderItem: OrderItem, item: Item, originalOrderItem?: OrderItem, originalOrder?: Order): number {
		return this._itemPriceService
			.rentPrice(item, orderItem.info.periodType, orderItem.info.numberOfPeriods, this.alreadyPayed(originalOrderItem, originalOrder));
	}

	public priceBuy(item: Item, originalOrderItem?: OrderItem, originalOrder?: Order): number {
		return this._itemPriceService.buyPrice(item, this.alreadyPayed(originalOrderItem, originalOrder));
	}

	public priceSell(item: Item): number {
		return this._itemPriceService.sellPrice(item);
	}

	public priceCancel(originalOrderItem?: OrderItem, originalOrder?: Order): number {
		return 0 - this.alreadyPayed(originalOrderItem, originalOrder);
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

	private alreadyPayed(originalOrderItem?: OrderItem, originalOrder?: Order): number {
		return (originalOrderItem && (originalOrder.payments && originalOrder.payments.length > 0)) ? originalOrderItem.amount : 0;
	}
}
