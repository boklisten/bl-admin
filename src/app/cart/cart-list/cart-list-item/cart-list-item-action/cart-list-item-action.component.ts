import {Component, Input, OnInit} from '@angular/core';
import {CartItem} from '../../../cartItem';
import {CartItemAction} from '../../../cartItemAction';

@Component({
	selector: 'app-cart-list-item-action',
	templateUrl: './cart-list-item-action.component.html',
	styleUrls: ['./cart-list-item-action.component.scss']
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	public actionList: string[];

	constructor() {
		this.actionList = [];
	}

	createActionList() {
		if (this.cartItem.order) {
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
				'deliver',
				'cancel'
			];
		} else {
			this.actionList = [
				'semester',
				'year',
				'buy',
				'sell'
			];
		}
	}

	ngOnInit() {
		this.createActionList();
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

	disableAction(action: CartItemAction): boolean {
		switch (action) {
			default:
				return false;

		}
	}

}
