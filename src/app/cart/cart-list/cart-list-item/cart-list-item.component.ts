import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from '@wizardcoder/bl-model';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {CartService} from '../../cart.service';
import {CartItem} from '../../cartItem';
import {CartItemAction} from '../../cartItemAction';
import {ItemPriceService} from '../../../price/item-price/item-price.service';
import {CustomerOrderService} from '../../../order/customer-order/customer-order.service';
import {OrderItemPriceService} from '../../../price/order-item-price/order-item-price.service';
import {DateService} from '../../../date/date.service';
import {Period} from '@wizardcoder/bl-model/dist/period/period';

@Component({
	selector: 'app-cart-list-item',
	templateUrl: './cart-list-item.component.html',
	styleUrls: ['./cart-list-item.component.scss']
})
export class CartListItemComponent implements OnInit {
	@Input() cartItem: CartItem;
	public cartItemAction: CartItemAction;
	public alreadyPayed: boolean;

	constructor(private _cartService: CartService, private _itemPriceService: ItemPriceService,
	            private _customerOrderService: CustomerOrderService, private _orderItemPriceService: OrderItemPriceService,
	            private _dateService: DateService) {
	}

	ngOnInit() {
		this.setAlreadyPayed();
	}

	public onActionChange(action: CartItemAction) {
		this.setAlreadyPayed();
	}

	public remove() {
		this._cartService.remove(this.cartItem.item.id);
	}

	public setAlreadyPayed() {
		if (!this.cartItem.originalOrder) {
			this.alreadyPayed = false;
			return;
		}

		this.alreadyPayed = this._orderItemPriceService.orderItemTypePayedFor(this.cartItem.orderItem, this.cartItem.originalOrder);

	}
}
