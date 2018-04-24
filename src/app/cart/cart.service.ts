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
import {CustomerOrderService} from '../order/customer-order/customer-order.service';
import {CustomerDetailService} from '../customer/customer-detail/customer-detail.service';
import {CustomerService} from '../customer/customer.service';

@Injectable()
export class CartService {
	private _cart: CartItem[];

	private _cartChange$: Subject<boolean>;

	constructor(private _itemPriceService: ItemPriceService, private _dateService: DateService, private itemService: ItemService, private _customerService: CustomerService) {
		this._cart = [];
		this._cartChange$ = new Subject<boolean>();

		this._customerService.onCustomerChange().subscribe(() => {
			console.log('the customer changed, have customer', this._customerService.haveCustomer());
			this.clear();
		});
	}

	public add(item: Item) {
		try {
			const orderAndOrderItem: { orderItem: OrderItem, order: Order } = this._customerService.haveOrderedItem(item.id);
			this.addOrderItem(orderAndOrderItem.orderItem, orderAndOrderItem.order);
		} catch (e) {
			console.log('customer did not have the item ordered, must add it manuel', item.title);
			this.addNewItem(item);
		}
	}

	public addOrderItem(orderItem: OrderItem, order: Order, item?: Item) {
		if (this.contains(orderItem.item)) {
			return;
		}

		if (!item) {
			this.itemService.getById(orderItem.item).then((foundItem: Item) => {
				this.addNewOrderItem(orderItem, order, foundItem);
			});
		} else {
			this.addNewOrderItem(orderItem, order, item);
		}
	}

	public addCustomerItem(customerItem: CustomerItem) {
		if (this.contains(customerItem.item)) {
			return;
		}

		this.itemService.getById(customerItem.item).then((item: Item) => {
			// this.addCartItem({item: Item, orderItem})
		});
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

	private addNewItem(item: Item) {
		let type: OrderItemType = 'rent';
		let price = this._itemPriceService.rentPrice(item, 'semester', 1);

		if (!item.rent || !this._customerService.haveCustomer()) {
			type = 'buy';
			price = this._itemPriceService.buyPrice(item);
			if (!item.buy && this._customerService.haveCustomer()) {
				type = 'sell';
				price = this._itemPriceService.sellPrice(item);
			}
		}

		const orderItem: OrderItem = {
			type: type,
			item: item.id,
			title: item.title,
			amount: price,
			unitPrice: item.price,
			taxRate: item.taxRate,
			taxAmount: 0,
			info: this.createOrderItemInfo(type)
		};

		this.addCartItem({
			item: item,
			orderItem: orderItem,
			action: this.getActionBasedOnOrderItem(orderItem.type)
		});
	}

	private addNewOrderItem(orderItem: OrderItem, order: Order, item: Item) {
		const newOrderItem: OrderItem = {
			type: orderItem.type,
			item: orderItem.item,
			title: orderItem.title,
			amount: orderItem.amount,
			unitPrice: orderItem.unitPrice,
			taxRate: orderItem.taxRate,
			taxAmount: orderItem.taxAmount,
			info: orderItem.info,
			discount: orderItem.discount
		};

		this.addCartItem({
			item: item,
			orderItem: newOrderItem,
			action: this.getActionBasedOnOrderItem(orderItem.type),
			originalOrder: order,
			originalOrderItem: orderItem
		});
	}

	private addCartItem(cartItem: CartItem) {
		this._cart.push(cartItem);
		this._cartChange$.next(true);
	}

	private getActionBasedOnOrderItem(type: OrderItemType): CartItemAction {
		if (type === 'rent') {
			return 'semester';
		} else {
			return type;
		}

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
