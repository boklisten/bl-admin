import {Component, Input, OnInit} from '@angular/core';
import {BlApiError, CustomerItem, Item, UserDetail} from '@wizardcoder/bl-model';
import {CustomerItemService, ItemService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-customer-item-list',
	templateUrl: './customer-item-list.component.html',
	styleUrls: ['./customer-item-list.component.scss']
})
export class CustomerItemListComponent implements OnInit {
	@Input() customerDetail: UserDetail;
	customerItems: CustomerItem[];

	constructor(private _customerItemService: CustomerItemService, private itemService: ItemService) {
		this.customerItems = [];
	}

	ngOnInit() {
		this._customerItemService.getManyByIds(this.customerDetail.customerItems).then((customerItems: CustomerItem[]) => {
			this.customerItems = customerItems;
		}).catch((getCustomerItemsError: BlApiError) => {
			console.log('customerItemListComponent: could not get customerItems', getCustomerItemsError);
		});
	}

}
