import {Component, Input, OnInit} from '@angular/core';
import {OrderItem} from '@wizardcoder/bl-model';
import {OrderItemType} from '@wizardcoder/bl-model/dist/order/order-item/order-item-type';
import {CartService} from '../../cart.service';
import {CartItem} from '../../cartItem';
import {CartItemAction} from '../../cartItemAction';

@Component({
	selector: 'app-cart-list-item',
	templateUrl: './cart-list-item.component.html',
	styleUrls: ['./cart-list-item.component.scss']
})
export class CartListItemComponent implements OnInit {
	@Input() cartItem: CartItem;
	public cartItemAction: CartItemAction;
	public alreadyPayed: boolean;

	constructor(private _cartService: CartService) {
	}

	ngOnInit() {
		this.checkAlreadyPayed();
	}


	remove() {
		this._cartService.remove(this.cartItem.item.id);
	}

	public checkAlreadyPayed() {
		if (this.cartItem.order) {
			this.alreadyPayed = true;
		} else {
			this.alreadyPayed = false;
		}
	}

}
