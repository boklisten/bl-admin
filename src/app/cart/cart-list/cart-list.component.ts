import {Component, OnInit} from '@angular/core';
import {CartService} from '../cart.service';
import {Item, OrderItem} from '@wizardcoder/bl-model';
import {ItemService} from '@wizardcoder/bl-connect';
import {CartItem} from '../cartItem';

@Component({
	selector: 'app-cart-list',
	templateUrl: './cart-list.component.html',
	styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
	public cart: CartItem[];

	constructor(private _cartService: CartService, private _itemService: ItemService) {
		this.cart = [];
	}

	ngOnInit() {
		this.cart = this._cartService.getCart();

		this._cartService.onCartChange().subscribe(() => {
			this.cart = this._cartService.getCart();
		});
	}

	remove(orderItem: OrderItem) {
		this._cartService.remove(orderItem.item);
	}

	getTotalAmount(): number {
		let totalAmount = 0;

		for (const cartItem of this.cart) {
			totalAmount += cartItem.orderItem.amount;
		}

		return totalAmount;
	}

}
