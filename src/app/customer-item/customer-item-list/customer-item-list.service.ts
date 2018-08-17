import {Injectable} from '@angular/core';
import {CustomerItem, Item} from '@wizardcoder/bl-model';
import {CustomerService} from '../../customer/customer.service';
import {CustomerItemService, ItemService} from '@wizardcoder/bl-connect';
import {CartService} from '../../cart/cart.service';

@Injectable({
	providedIn: 'root'
})
export class CustomerItemListService {
	private _customerItemList: { customerItem: CustomerItem, item: Item }[];

	constructor(private _customerService: CustomerService,
	            private _itemService: ItemService,
	            private _cartService: CartService,
	            private _customerItemService: CustomerItemService) {
		this._customerItemList = [];
	}

	public getItemWithIsbn(isbn: string) {
		for (const customerItemWithItem of this._customerItemList) {
			if (customerItemWithItem.item.info && customerItemWithItem.item.info['isbn']) {
				if (customerItemWithItem.item.info['isbn'] === isbn) {
					return customerItemWithItem;
				}
			}
		}
	}

	public async addItemWithIsbn(isbn: string): Promise<boolean> {
		if (this._customerItemList.length <= 0) {
			this._customerItemList = await this.getCustomerItems();
		}

		const cartItemWithItem = this.getItemWithIsbn(isbn);

		if (cartItemWithItem) {
			if (!this._cartService.contains(cartItemWithItem.item.id)) {
				this._cartService.addCustomerItem(cartItemWithItem.customerItem, cartItemWithItem.item);
				return true;
			}
		}

		return false;
	}

	public async getCustomerItems(): Promise<{ customerItem: CustomerItem, item: Item }[]> {
		const customerItemList = [];
		const customerDetail = this._customerService.getCustomerDetail();

		const customerItems = await this._customerItemService.getManyByIds(customerDetail.customerItems);

		for (const customerItem of customerItems) {
			if (!customerItem.returned && !customerItem.buyout && customerItem.handout) {

				const item = await this._itemService.getById(customerItem.item);
				customerItemList.push({customerItem: customerItem, item: item});
			}
		}

		return customerItemList;
	}
}