import {Component, Input, OnInit} from '@angular/core';
import {BlApiError, CustomerItem, Item, UserDetail} from '@wizardcoder/bl-model';
import {CustomerItemService, ItemService} from '@wizardcoder/bl-connect';
import {CartService} from '../../cart/cart.service';
import {CustomerService} from '../../customer/customer.service';
import {CustomerItemListService} from './customer-item-list.service';

@Component({
	selector: 'app-customer-item-list',
	templateUrl: './customer-item-list.component.html',
	styleUrls: ['./customer-item-list.component.scss']
})
export class CustomerItemListComponent implements OnInit {
	@Input() title: string;
	public customerDetail: UserDetail;
	public customerItemsWithItem: {customerItem: CustomerItem, item: Item}[];
	public wait: boolean;

	constructor(private _customerItemService: CustomerItemService,
	            private itemService: ItemService,
	            private _customerItemListService: CustomerItemListService,
	            private _cartService: CartService,
	            private _customerService: CustomerService) {
		this.customerItemsWithItem = [];
	}

	ngOnInit() {
		if (this._customerService.haveCustomer()) {
			this.customerDetail = this._customerService.get().detail;
			this.getCustomerItems();
		}

		this._customerService.onCustomerChange().subscribe(() => {
			if (this._customerService.haveCustomer()) {
				this.customerDetail = this._customerService.get().detail;
				this.getCustomerItems();
			}
		});

		this._customerItemListService.onWait().subscribe((wait) => {
			this.wait = wait;
		});
	}

	getCustomerItems() {
		this.wait = true;
		this._customerItemListService.getCustomerItems().then((customerItemsWithItem) => {
			this.customerItemsWithItem = customerItemsWithItem;
			this.wait = false;
		}).catch((err) => {
			console.log('customerItemList: could not get customer items');
		});
	}
}
