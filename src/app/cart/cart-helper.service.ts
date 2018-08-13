import {Injectable} from '@angular/core';
import {CartItemAction} from './cartItemAction';
import {BranchStoreService} from '../branch/branch-store.service';
import {CartItem} from './cartItem';
import {Branch, CustomerItem, Item, OrderItem} from '@wizardcoder/bl-model';
import {CustomerService} from '../customer/customer.service';
import {ItemPriceService} from '../price/item-price/item-price.service';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {OrderItemInfo} from '@wizardcoder/bl-model/dist/order/order-item/order-item-info';
import {DateService} from '../date/date.service';
import {OrderItemPriceService} from '../price/order-item-price/order-item-price.service';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {CustomerItemPriceService} from '../price/customer-item-price/customer-item-price.service';
import {BranchItemHelperService} from '../branch/branch-item-helper/branch-item-helper.service';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class CartHelperService {

	constructor(private _branchStoreService: BranchStoreService, private _customerService: CustomerService,
	            private _itemPriceService: ItemPriceService, private _dateService: DateService,
	            private _orderItemPriceService: OrderItemPriceService, private _customerItemPriceService: CustomerItemPriceService,
	            private _authService: AuthService,
	            private _branchItemHelperService: BranchItemHelperService) {
	}

	public cartItemActionValidOnBranch(action: CartItemAction): boolean {
		const branch = this._branchStoreService.getCurrentBranch();
		if (action === 'semester' || action === 'year') {
			for (const rentPeriod of branch.paymentInfo.rentPeriods) {
				if (rentPeriod.type === action) {
					return true;
				}
			}
			return false;
		}
		return true;
	}

	public isActionValidOnItem(action, item: Item): boolean {
		if ((action === 'semester' || action === 'year') && this._customerService.haveCustomer()) {
			return this._branchItemHelperService.isRentValid(item, action);
		} else if (action === 'buy') {
			return this._branchItemHelperService.isBuyValid(item);
		} else if (action === 'sell' && this._customerService.haveCustomer()) {
			return this._branchItemHelperService.isSellValid(item);
		} else {
			return false;
		}
	}

	public isActionValidOnCartItem(action: CartItemAction, cartItem: CartItem): boolean {
		if (!cartItem.customerItem) {
			if ((action === 'semester' || action === 'year') && this._customerService.haveCustomer()) {
				return this._branchItemHelperService.isRentValid(cartItem.item, action);
			} else if (action === 'buy') {
				return this._branchItemHelperService.isBuyValid(cartItem.item);
			} else if (action === 'sell' && this._customerService.haveCustomer()) {
				return this._branchItemHelperService.isSellValid(cartItem.item);
			} else if (action === 'cancel') {
				if (this._authService.isManager()) {
					return this._dateService.isOrderItemCancelValid(cartItem.originalOrder.creationTime);
				} else {
					return false;
				}
			}
		} else {
			if (action === 'cancel') {
				if (this._authService.isManager()) {
					return (cartItem.customerItem.handout && this._dateService.isCustomerItemCancelValid(cartItem.customerItem.handoutInfo.time));
				} else {
					return false;
				}
			} else if (action === 'return') {
				return (cartItem.customerItem.handout
					&& this._dateService.isCustomerItemReturnValid(cartItem.customerItem.deadline)
					&& !this._dateService.isCustomerItemCancelValid(cartItem.customerItem.handoutInfo.time));
			} else if (action === 'buyout') {
				return (cartItem.customerItem.handout && this._dateService.isCustomerItemReturnValid(cartItem.customerItem.deadline));
			} else if (action === 'extend') {
				return (cartItem.customerItem.handout
					&& this._dateService.isCustomerItemReturnValid(cartItem.customerItem.deadline)
					&& this._dateService.isCustomerItemExtendValid(cartItem.customerItem.deadline, 'semester'));
			}

		}

		return false;
	}

	public createOrderItemBasedOnCustomerItem(customerItem: CustomerItem, item: Item) {
		if (!this._dateService.isCustomerItemReturnValid(customerItem.deadline) && !this._authService.isAdmin()) {
			throw new Error('can not add customer item to cart, the deadline is overdue');
		}

		if (this._dateService.isCustomerItemCancelValid(customerItem.handoutInfo.time) && this._authService.isManager()) {
			return this.createOrderItemTypeCancel(customerItem, item);
		} else if (this._dateService.isCustomerItemReturnValid(customerItem.deadline) && !this._dateService.isCustomerItemCancelValid(customerItem.handoutInfo.time)) {
			return this.createOrderItemTypeReturn(customerItem, item);
		} else if (this._dateService.isCustomerItemExtendValid(customerItem.deadline, 'semester')) {
			return this.createOrderItemTypeExtend(customerItem, item, 'semester');
		} else if (this._branchItemHelperService.isBuyValid(item)) {
			return this.createOrderItemTypeBuyout(customerItem, item);
		} else {
			throw new Error('cartHelperService: this customerItem can not be handled');
		}
	}

	public createOrderItemTypeExtend(customerItem: CustomerItem, item: Item, period: Period): OrderItem {
		const orderItem: OrderItem = {
			type: 'extend',
			item: item.id,
			title: item.title,
			amount: 0,
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			customerItem: customerItem.id
		};

		const orderItemAmounts = this._customerItemPriceService.calculateAmountsExtend(customerItem, period, item);
		orderItem.amount = orderItemAmounts.amount;
		orderItem.unitPrice = orderItemAmounts.unitPrice;
		orderItem.taxAmount = orderItemAmounts.taxAmount;
		orderItem.taxRate = item.taxRate;

		return orderItem;
	}

	public createOrderItemTypeCancel(customerItem: CustomerItem, item: Item): OrderItem {
		return {
			type: 'cancel',
			item: item.id,
			title: item.title,
			amount: this._customerItemPriceService.priceCancel(customerItem),
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			customerItem: customerItem.id
		};
	}

	public createOrderItemTypeReturn(customerItem: CustomerItem, item: Item): OrderItem {

		return {
			type: 'return',
			item: item.id,
			title: item.title,
			amount: this._customerItemPriceService.priceReturn(customerItem),
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			customerItem: customerItem.id
		};
	}

	public createOrderItemTypeBuyout(customerItem: CustomerItem, item: Item): OrderItem {
		const orderItemAmounts = this._customerItemPriceService.calculateAmountsBuyout(item);

		return {
			type: 'buyout',
			item: item.id,
			title: item.title,
			amount: orderItemAmounts.amount,
			unitPrice: orderItemAmounts.unitPrice,
			taxAmount: orderItemAmounts.taxAmount,
			taxRate: item.taxRate,
			customerItem: customerItem.id
		};
	}


	public createOrderItemBasedOnItem(item: Item): OrderItem {
		let action: CartItemAction;

		try {
			action = this.getFirstValidActionOnItem(item);
		} catch (e) {
			throw new Error('no action can be done on this item');
		}

		const orderItem = {
			type: action,
			taxRate: item.taxRate
		} as OrderItem;

		if (action === 'rent' || action === 'semester' || action === 'year' || action === 'buy') {
			orderItem.handout = true;
		}

		const calculatedOrderItemAmounts = this._orderItemPriceService.calculateAmounts(orderItem, item);

		orderItem.item = item.id;
		orderItem.title = item.title;
		orderItem.unitPrice = calculatedOrderItemAmounts.unitPrice;
		orderItem.taxRate = calculatedOrderItemAmounts.taxAmount;
		orderItem.amount = calculatedOrderItemAmounts.amount;
		orderItem.info = this.createDefaultOrderItemInfo(this.orderItemTypeBasedOnAction(action));


		return orderItem;
	}

	public getFirstValidActionOnItem(item: Item) {
		const actionList: CartItemAction[] = [
			'semester',
			'year',
			'buy',
			'sell'
		];

		for (const action of actionList) {
			if (this.cartItemActionValidOnBranch(action)) {
				if (this.isActionValidOnItem(action, item)) {
					return action;
				}
			}
		}

		throw new Error('no action on item is valid');
	}

	public getFirstValidActionOnCartItem(cartItem: CartItem) {
		const actionList: CartItemAction[] = [
			'semester',
			'year',
			'buy',
			'sell'
		];

		for (const action of actionList) {
			if (this.cartItemActionValidOnBranch(action)) {
				if (this.isActionValidOnCartItem(action, cartItem)) {
					return action;
				}
			}
		}

		throw new Error('no action on item is valid');

	}

	public orderItemTypeBasedOnAction(action: CartItemAction): OrderItemType {
		if (action === 'semester' || action === 'year') {
			return 'rent';
		} else {
			return action as OrderItemType;
		}
	}

	public orderItemPriceBasedOnAction(action: CartItemAction, item: Item, alreadyPayed?: number): number {
		const alreadyPayedAmount = (alreadyPayed) ? alreadyPayed : 0;

		if (action === 'semester' || action === 'year') {
			return this._itemPriceService.rentPrice(item, action, 1, alreadyPayedAmount);
		} else if (action === 'buy') {
			return this._itemPriceService.buyPrice(item, alreadyPayedAmount);
		} else if (action === 'sell') {
			return this._itemPriceService.sellPrice(item);
		}
	}

	private createDefaultOrderItemInfo(type: OrderItemType): OrderItemInfo {
		if (type === 'rent') {
			let periodType: 'semester' | 'year';

			if (this.cartItemActionValidOnBranch('semester')) {
				periodType = 'semester';
			} else if (this.cartItemActionValidOnBranch('year')) {
				periodType = 'year';
			} else {
				return null;
			}

			const fromTo = this._dateService.rentPeriod(periodType);

			return {
				from: fromTo.from,
				to: fromTo.to,
				numberOfPeriods: 1,
				periodType: periodType
			};
		}
	}
}
