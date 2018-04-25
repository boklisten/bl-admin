import {Injectable} from '@angular/core';
import {CartItemAction} from './cartItemAction';
import {BranchStoreService} from '../branch/branch-store.service';
import {CartItem} from './cartItem';
import {Item, OrderItem} from '@wizardcoder/bl-model';
import {CustomerService} from '../customer/customer.service';
import {ItemPriceService} from '../price/item-price/item-price.service';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {OrderItemInfo} from '@wizardcoder/bl-model/dist/order/order-item/order-item-info';
import {DateService} from '../date/date.service';

@Injectable()
export class CartHelperService {

	constructor(private _branchStoreService: BranchStoreService, private _customerService: CustomerService,
	            private _itemPriceService: ItemPriceService, private _dateService: DateService) {
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

	public actionValidOnItem(action: CartItemAction, item: Item): boolean {
		if (action === 'semester' || action === 'year' && this._customerService.haveCustomer()) {
			if (item.rent) {
				return true;
			}
		} else if (action === 'buy') {
			if (item.buy) {
				return true;
			}
		} else if (action === 'sell' && this._customerService.haveCustomer()) {
			if (item.sell) {
				return true;
			}
		} else {
			return true;
		}

		return false;
	}

	public createOrderItemBasedOnItem(item: Item): OrderItem {
		let action: CartItemAction;

		try {
			action = this.getFirstValidActionOnItem(item);
		} catch (e) {
			throw new Error('no action can be done on this item');
		}

		return {
			type: this.orderItemTypeBasedOnAction(action),
			item: item.id,
			title: item.title,
			amount: this.orderItemPriceBasedOnAction(action, item),
			unitPrice: item.price,
			taxRate: item.taxRate,
			taxAmount: 0,
			info: this.createDefaultOrderItemInfo(this.orderItemTypeBasedOnAction(action))
		};
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

	public getFirstValidActionOnItem(item: Item) {
		const actionList: CartItemAction[] = [
			'semester',
			'year',
			'buy',
			'sell'
		];

		for (const action of actionList) {
			if (this.cartItemActionValidOnBranch(action)) {
				if (this.actionValidOnItem(action, item)) {
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
}
