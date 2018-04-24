import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartItem} from '../../../cartItem';
import {CartItemAction} from '../../../cartItemAction';
import {CustomerOrderService} from '../../../../order/customer-order/customer-order.service';
import {OrderItemPriceService} from '../../../../price/order-item-price/order-item-price.service';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {DateService} from '../../../../date/date.service';
import {CustomerService} from '../../../../customer/customer.service';

@Component({
	selector: 'app-cart-list-item-action',
	templateUrl: './cart-list-item-action.component.html',
	styleUrls: ['./cart-list-item-action.component.scss']
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() actionChange: EventEmitter<CartItemAction>;

	public actionList: CartItemAction[];

	constructor(private _orderItemPriceService: OrderItemPriceService, private _dateService: DateService, private _customerService: CustomerService) {
		this.actionList = [];
		this.actionChange = new EventEmitter<CartItemAction>();
	}

	ngOnInit() {
		this.createActionList();
	}

	createActionList() {
		if (this.cartItem.originalOrder) {
			this.actionList = [
				'semester',
				'year',
				'buy',
				'cancel'
			];
		} else if (this.cartItem.customerItem) {
			this.actionList = [
				'extend',
				'buyout',
				'cancel'
			];
		} else if (this._customerService.haveCustomer()) {
			this.actionList = [
				'semester',
				'year',
				'buy',
				'sell'
			];
		} else {
			this.actionList = [
				'buy'
			];
		}

		this.selectDefaultAction();
	}

	showAction(action: CartItemAction): boolean {
		switch (action) {
			case 'semester':
				return this.cartItem.item.rent;
			case 'year':
				return this.cartItem.item.rent;
			case 'buy':
				return this.cartItem.item.buy;
			case 'sell':
				return this.cartItem.item.sell;
			case 'cancel':
				return true;
			default:
				return false;
		}
	}

	onActionChange(action: CartItemAction) {
		this.cartItem.action = action;
		this.updateOrderItemBasedOnAction(this.cartItem.action);
		this.actionChange.emit(this.cartItem.action);

	}

	disableAction(action: CartItemAction): boolean {
		switch (action) {
			default:
				return false;
		}
	}

	originalAction(action: CartItemAction): boolean {
		if (!this.cartItem.originalOrderItem) {
			return false;
		} else {
			if (this.cartItem.originalOrderItem.type === 'rent') {
				return (action === this.cartItem.originalOrderItem.info.periodType);
			} else {
				return (action === this.cartItem.originalOrderItem.type);
			}
		}
	}

	private selectDefaultAction() {
		if (this.cartItem.originalOrder) {
			if (this.cartItem.orderItem.type === 'rent') {
				this.onActionChange(this.cartItem.orderItem.info.periodType);
			} else {
				this.onActionChange(this.cartItem.orderItem.type);
			}
		} else {
			this.onActionChange(this.cartItem.orderItem.type);
		}
	}

	private updateOrderItemBasedOnAction(action: CartItemAction) {
		switch (action) {
			case 'semester':
				this.updateOrderItemRent('semester');
				break;
			case 'year':
				this.updateOrderItemRent('year');
				break;
			case 'buy':
				this.updateOrderItem(action);
				break;
			case 'sell':
				this.updateOrderItem(action);
				break;
			case 'cancel':
				this.updateOrderItem('cancel' as any);
				break;
		}

		this.cartItem.orderItem.amount = this._orderItemPriceService.calculateOrderItemPrice(this.cartItem.orderItem,
			this.cartItem.item, this.cartItem.originalOrder, (this.cartItem.originalOrderItem) ? this.cartItem.originalOrderItem.amount : 0);
	}

	private updateOrderItem(type: OrderItemType) {
		this.cartItem.orderItem.type = type;
		this.cartItem.orderItem.info = null;
	}

	private updateOrderItemRent(period: Period) {
		this.cartItem.orderItem.type = 'rent';
		let rentPeriod = this._dateService.rentPeriod(period);

		if (this.originalAction(period)) {
			rentPeriod = {to: this.cartItem.originalOrderItem.info.to, from: this.cartItem.originalOrderItem.info.from};
		}

		this.cartItem.orderItem.info = {
			from: rentPeriod.from,
			to: rentPeriod.to,
			numberOfPeriods: 1,
			periodType: period
		};
	}

}
