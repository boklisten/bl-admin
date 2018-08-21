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
import {OrderItemHelperService} from '../../../order-item-helper/order-item-helper.service';
import {AuthService} from '../../../../auth/auth.service';

@Component({
	selector: 'app-cart-list-item-action',
	templateUrl: './cart-list-item-action.component.html',
	styleUrls: ['./cart-list-item-action.component.scss']
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() actionChange: EventEmitter<CartItemAction>;

	public actionList: CartItemAction[];

	constructor(private _orderItemPriceService: OrderItemPriceService,
	            private _dateService: DateService,
	            private _customerService: CustomerService,
	            private _cartHelperService: CartHelperService,
	            private _authService: AuthService,
	            private _orderItemHelperService: OrderItemHelperService,
	            private _customerItemPriceService: CustomerItemPriceService) {
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

		return (this._cartHelperService.isActionValidOnCartItem(action, this.cartItem));
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
		this._orderItemHelperService.updateOrderItem(action, this.cartItem.orderItem, this.cartItem.item, this.cartItem.customerItem).then(() => {

		}).catch(() => {
			console.log('cartListItemAction: could not update orderItem');
		});
	}
}
