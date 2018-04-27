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
import {BranchStoreService} from '../branch/branch-store.service';
import {CartHelperService} from './cart-helper.service';

@Injectable()
export class CartService {
	private _cart: CartItem[];

	private _cartChange$: Subject<boolean>;
	private _customerDetailId: string;

	constructor(private _itemPriceService: ItemPriceService, private _dateService: DateService, private itemService: ItemService,
	            private _customerService: CustomerService, private _branchStoreService: BranchStoreService,
	            private _cartHelperService: CartHelperService) {

		this._cart = [];
		this._cartChange$ = new Subject<boolean>();

		if (this._customerService.haveCustomer()) {
			this._customerDetailId = this._customerService.get().detail.id;
		}

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				if (this._customerDetailId && (this._customerService.get().detail.id === this._customerDetailId)) {
					return;
				} else {
					this._customerDetailId = this._customerService.get().detail.id;
					this.clear();
				}
			} else {
				this.clear();
			}
		});

		this._branchStoreService.onBranchChange().subscribe(() => {
			this.clear();
		});
	}

	public getCartItemsApartOfNewOrder(): CartItem[] {
		const cartItems: CartItem[] = [];

		for (const cartItem of this._cart) {
			if (!(cartItem.orderItem.amount === 0 && cartItem.originalOrderItem && (cartItem.originalOrderItem.amount !== cartItem.orderItem.amount))) {
				cartItems.push(cartItem);
			}
		}

		return cartItems;
	}

	public getCartItemsNotApartOfNewOrder(): CartItem[] {
		const cartItems: CartItem[] = [];

		for (const cartItem of this._cart) {
			if (cartItem.orderItem.amount === 0 && cartItem.originalOrderItem) {
				cartItems.push(cartItem);
			}
		}

		return cartItems;
	}

	public add(item: Item) {
		try {
			const orderAndOrderItem: { orderItem: OrderItem, order: Order } = this._customerService.haveOrderedItem(item.id);
			this.addOrderItem(orderAndOrderItem.orderItem, orderAndOrderItem.order);
		} catch (e) {
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

	public getTotalAmount(): number {
		let totalAmount = 0;

		this._cart.forEach((cartItem: CartItem) => {
			totalAmount += cartItem.orderItem.amount;
		});

		return totalAmount;
	}

	private addNewItem(item: Item) {
		let orderItem: OrderItem;

		try {
			orderItem = this._cartHelperService.createOrderItemBasedOnItem(item);
		} catch (e) {
			console.log('the item can not be added', e);
		}

		this.addCartItem({
			item: item,
			orderItem: orderItem,
			action: this._cartHelperService.getFirstValidActionOnItem(item)
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
			const branch = this._branchStoreService.getCurrentBranch();
			if (branch.paymentInfo.rentPeriods && branch.paymentInfo.rentPeriods.length > 0) {
				return branch.paymentInfo.rentPeriods[0].type;
			}
		} else {
			return type;
		}

	}




}
