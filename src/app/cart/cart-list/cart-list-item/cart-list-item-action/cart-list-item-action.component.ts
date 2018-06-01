import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CartItem} from '../../../cartItem';
import {CartItemAction} from '../../../cartItemAction';
import {OrderItemPriceService} from '../../../../price/order-item-price/order-item-price.service';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {Period} from '@wizardcoder/bl-model/dist/period/period';
import {DateService} from '../../../../date/date.service';
import {CustomerService} from '../../../../customer/customer.service';
import {CartHelperService} from '../../../cart-helper.service';
import {CustomerItemPriceService} from '../../../../price/customer-item-price/customer-item-price.service';

@Component({
	selector: 'app-cart-list-item-action',
	templateUrl: './cart-list-item-action.component.html',
	styleUrls: ['./cart-list-item-action.component.scss']
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() actionChange: EventEmitter<CartItemAction>;

	public actionList: CartItemAction[];

	constructor(private _orderItemPriceService: OrderItemPriceService, private _dateService: DateService, private _customerService: CustomerService,
	            private _cartHelperService: CartHelperService, private _customerItemPriceService: CustomerItemPriceService) {
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
				'return',
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
		if (this.cartItem.originalOrderItem && this.cartItem.originalOrderItem.type === 'rent') {
			if (action === 'semester' || action === 'year') {
				return true;
			}
		}

		return (this._cartHelperService.actionValidOnItem(action, this.cartItem.item, this.cartItem.customerItem));
	}

	onActionChange(action: CartItemAction) {
		this.cartItem.action = action;
		this.updateOrderItemBasedOnAction(this.cartItem.action);
		this.actionChange.emit(this.cartItem.action);

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
		if (this.cartItem.orderItem.type === 'rent') {
			this.onActionChange(this.cartItem.orderItem.info.periodType);
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
			case 'return':
				this.updateOrderItem(action);
				break;
			case 'extend':
				this.updateOrderItemExtend();
				break;
			case 'buyout':
				this.updateOrderItem(action);
				break;
			case 'cancel':
				this.updateOrderItem('cancel');
				break;
		}

		if (this.cartItem.customerItem) {
			this.cartItem.orderItem.amount = this.orderItemAmountBasedOnCustomerItem();
		} else {
			this.cartItem.orderItem.amount = this.orderItemAmount();
		}
	}

	private orderItemAmount(): number {
		switch (this.cartItem.action) {
			case 'year':
				return this._orderItemPriceService
					.priceRent(this.cartItem.orderItem, this.cartItem.item, this.cartItem.originalOrderItem, this.cartItem.originalOrder);
			case 'semester':
				return this._orderItemPriceService
					.priceRent(this.cartItem.orderItem, this.cartItem.item, this.cartItem.originalOrderItem, this.cartItem.originalOrder);
			case 'buy':
				return this._orderItemPriceService.priceBuy(this.cartItem.item, this.cartItem.originalOrderItem, this.cartItem.originalOrder);
			case 'cancel':
				return this._orderItemPriceService.priceCancel(this.cartItem.originalOrderItem, this.cartItem.originalOrder);
			case 'sell':
				return this._orderItemPriceService.priceSell(this.cartItem.item);
		}
	}


	private orderItemAmountBasedOnCustomerItem(): number {
		switch (this.cartItem.action) {
			case 'buyout':
				return this._customerItemPriceService.priceBuyout(this.cartItem.item);
			case 'extend':
				return this._customerItemPriceService.priceExtend(this.cartItem.customerItem, this.cartItem.item, this.cartItem.orderItem.info.periodType);
			case 'cancel':
				return this._customerItemPriceService.priceCancel(this.cartItem.customerItem);
			case 'return':
				return this._customerItemPriceService.priceReturn(this.cartItem.customerItem);
		}
	}

	private updateOrderItemExtend() {
		this.cartItem.orderItem.type = 'extend';
		const extendPeriod = this._dateService.extendPeriod('semester');

		this.cartItem.orderItem.info = {
			from: extendPeriod.from,
			to: extendPeriod.to,
			numberOfPeriods: 1,
			periodType: 'semester',
			customerItem: this.cartItem.customerItem.id
		};
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
