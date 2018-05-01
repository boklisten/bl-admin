import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CustomerItemService, ItemService} from '@wizardcoder/bl-connect';
import {CustomerItem, Item} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-customer-item-detail',
	templateUrl: './customer-item-detail.component.html',
	styleUrls: ['./customer-item-detail.component.scss']
})
export class CustomerItemDetailComponent implements OnInit {
	public customerItem:  CustomerItem;
	public item: Item;

	constructor(private _route: ActivatedRoute, private _customerItemService: CustomerItemService, private _itemService: ItemService) {

	}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {

			if (params['id']) {
				this.getCustomerItem(params['id']);
			}
		});
	}

	private getCustomerItem(id: string) {
		this._customerItemService.getById(id).then((customerItem: CustomerItem) => {

			this._itemService.getById(customerItem.item).then((item: Item) => {
				this.item = item;
			}).catch((getItemError) => {
				console.log('customerItemDetailComponet: could not get item');
			});

			this.customerItem = customerItem;
		}).catch((getCustomerItemError) => {
			console.log('customerItemDetailComponent: could not get customerItem', getCustomerItemError);
		});
	}

}
