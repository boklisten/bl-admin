import {Component, Input, OnInit} from '@angular/core';
import {BlApiError, CustomerItem, Item, UserDetail} from '@wizardcoder/bl-model';
import {CustomerItemService, ItemService} from '@wizardcoder/bl-connect';
import {CartService} from '../../cart/cart.service';
import {CustomerService} from '../../customer/customer.service';

@Component({
	selector: 'app-customer-item-list',
	templateUrl: './customer-item-list.component.html',
	styleUrls: ['./customer-item-list.component.scss']
})
export class CustomerItemListComponent implements OnInit {
	customerDetail: UserDetail;
	@Input() title: string;
	customerItems: CustomerItem[];

	constructor(private _customerItemService: CustomerItemService, private itemService: ItemService, private _cartService: CartService,
	            private _customerService: CustomerService) {
		this.customerItems = [];
	}

	ngOnInit() {

		if (this._customerService.haveCustomer()) {
			this.customerDetail = this._customerService.get().detail;
			this.getCustomerItems();
		}

		this._customerService.onCustomerChange().subscribe(() => {
			console.log('customer changed, needs to change customerItemList');
			if (this._customerService.haveCustomer()) {
				this.customerDetail = this._customerService.get().detail;
				this.getCustomerItems();
			}
		});

	}

	getCustomerItems() {

		this._customerItemService.getManyByIds(this.customerDetail.customerItems).then((customerItems: CustomerItem[]) => {
			console.log('fetched the customerItems!');
			const activeCustomerItems: CustomerItem[] = [];

			for (const customerItem of customerItems) {
				if (!customerItem.returned && !customerItem.buyout && customerItem.handout) {
					activeCustomerItems.push(customerItem);
				}
			}

			this.customerItems = activeCustomerItems;
		}).catch((getCustomerItemsError: BlApiError) => {
			console.log('customerItemListComponent: could not get customerItems', getCustomerItemsError);
		});
	}

}
