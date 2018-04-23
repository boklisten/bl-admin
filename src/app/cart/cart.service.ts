import {Injectable} from '@angular/core';
import {CustomerItem, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {ItemPriceService} from '../price/item-price/item-price.service';
import {OrderItemInfo} from '@wizardcoder/bl-model/dist/order/order-item/order-item-info';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {DateService} from '../date/date.service';
import {Subject} from 'rxjs/Subject';
import {CartItem} from './cartItem';
import {ItemService} from '@wizardcoder/bl-connect';
import {CartItemAction} from './cartItemAction';

@Injectable()
export class CartService {
	private _cart: CartItem[];

	private _cartChange$: Subject<boolean>;

	constructor(private _itemPriceService: ItemPriceService, private _dateService: DateService, private itemService: ItemService) {
		this._cart = [];
		this._cartChange$ = new Subject<boolean>();
	}

	public add(item: Item) {
		if (this.contains(item.id)) {
			return;
		}

		const newOrderItem = this.createDefaultOrderItem(item);
		this.addCartItem({item: item, orderItem: newOrderItem, action: 'semester'});
	}

	public addOrderItem(orderItem: OrderItem, order?: Order) {
		if (this.contains(orderItem.item)) {
			return;
		}

		this.itemService.getById(orderItem.item).then((item: Item) => {
			this.addCartItem({item: item, orderItem: orderItem, action: this.getActionBasedOnOrderItem(orderItem), order: order});
		});
	}


	public addCustomerItem(customerItem: CustomerItem) {
		if (this.contains(customerItem.item)) {
			return;
		}

		this.itemService.getById(customerItem.item).then((item: Item) => {
			//this.addCartItem({item: Item, orderItem})
		});
	}

	private addCartItem(cartItem: CartItem) {
		this._cart.push(cartItem);
		this._cartChange$.next(true);
	}

	private getActionBasedOnOrderItem(orderItem: OrderItem): CartItemAction {
		if (orderItem.type === 'rent') {
			return 'semester';
		} else {
			return orderItem.type;
		}

	}

	public remove(itemId: string) {
		for (let i = 0; i < this._cart.length; i++) {
			if (this._cart[i].item.id === itemId) {
				this._cart.splice(i, 1);
				this._cartChange$.next(true);
				return;
			}
		}

	}

	public contains(itemId: string) {
		for (const orderItem of this._cart) {
			if (orderItem.item.id === itemId) {
				return true;
			}
		}

		return false;
	}

	public clear() {
		this._cart = [];
		this._cartChange$.next(true);
	}

	public onCartChange() {
		return this._cartChange$;
	}

	public getCart(): CartItem[] {
		return this._cart;
	}

	private createDefaultOrderItem(item: Item): OrderItem {
		return {
			type: 'rent',
			item: item.id,
			title: item.title,
			amount: this._itemPriceService.rentPrice(item, 'semester', 1),
			unitPrice: item.price,
			taxRate: item.taxRate,
			taxAmount: 0,
			info: this.createOrderItemInfo('rent')
		};
	}

	private createOrderItemInfo(type: OrderItemType): OrderItemInfo {
		if (type === 'rent') {
			const fromTo = this._dateService.rentPeriod('semester');

			return {
				from: fromTo.from,
				to: fromTo.to,
				numberOfPeriods: 1,
				periodType: 'semester'
			};
		}
	}


}
