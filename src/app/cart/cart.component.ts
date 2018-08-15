import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Item, Order, UserDetail} from '@wizardcoder/bl-model';
import {CustomerService} from '../customer/customer.service';
import {ItemService} from '@wizardcoder/bl-connect';
import {CartService} from './cart.service';
import {tick} from '@angular/core/testing';
import {CartItemSearchService} from './cart-item-search/cart-item-search.service';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
	public haveCustomer: boolean;
	public cartConfirmText: string;
	public cartFailureText: string;
	public customerDetail: UserDetail;

	constructor(private _customerService: CustomerService, private _itemService: ItemService, private _cartService: CartService, private _cartItemSearchService: CartItemSearchService) {
		this.haveCustomer = false;
	}

	ngOnInit() {
		this.haveCustomer = this._customerService.haveCustomer();
		this.setCustomerDetail();
		this._customerService.onCustomerChange().subscribe(() => {
			this.haveCustomer = this._customerService.haveCustomer();
			this.setCustomerDetail();

			/*
			this._itemService.get().then((items: Item[]) => {
				this._cartService.add(items[0]);
				this._cartService.add(items[1]);
			});
			*/

		});
	}

	setCustomerDetail() {
		if (this._customerService.haveCustomer()) {
			this.customerDetail = this._customerService.get().detail;
		}
	}

	public onCartConfirmed() {
		this._cartService.confirmCart();
		this.cartConfirmText = 'The order was confirmed';

		setTimeout(() => {
			this.cartConfirmText = null;
		}, 2000);

	}

	public onCartFailed() {

	}


}
