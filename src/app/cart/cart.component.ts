import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Item, Order} from '@wizardcoder/bl-model';
import {CustomerService} from '../customer/customer.service';
import {ItemService} from '@wizardcoder/bl-connect';
import {CartService} from './cart.service';
import {tick} from '@angular/core/testing';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
	public haveCustomer: boolean;

	constructor(private _customerService: CustomerService, private _itemService: ItemService, private _cartService: CartService) {
		this.haveCustomer = false;
	}

	ngOnInit() {
		this.haveCustomer = this._customerService.haveCustomer();

		this._customerService.onCustomerChange().subscribe(() => {
			this.haveCustomer = this._customerService.haveCustomer();
			/*
			this._itemService.get().then((items: Item[]) => {
				this._cartService.add(items[0]);
				this._cartService.add(items[1]);
			});
			*/

		});
	}


}
