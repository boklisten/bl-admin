import { Injectable } from "@angular/core";
import { CustomerItem, Item } from "@wizardcoder/bl-model";
import { CustomerService } from "../../customer/customer.service";
import { CustomerItemService, ItemService } from "@wizardcoder/bl-connect";
import { CartService } from "../../cart/cart.service";
import { Observable, ReplaySubject, Subscription } from "rxjs";
import { Subject } from "rxjs/internal/Subject";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";

type CustomerItemWithItem = {
	customerItem: CustomerItem;
	item: Item;
};

@Injectable({
	providedIn: "root"
})
export class CustomerItemListService {
	private _customerItemList: { customerItem: CustomerItem; item: Item }[];
	private _customerItems$: ReplaySubject<CustomerItemWithItem[]>;

	constructor(
		private _customerService: CustomerService,
		private _itemService: ItemService,
		private _cartService: CartService,
		private _customerItemService: CustomerItemService,
		private _customerDetailService: CustomerDetailService
	) {
		this._customerItemList = [];
		this._customerItems$ = new ReplaySubject(1);
		this.handleCustomerChange();
		this.handleCustomerClear();
	}

	public subscribe(
		func: (customerItems: CustomerItemWithItem[]) => void
	): Subscription {
		return this._customerItems$.asObservable().subscribe(func);
	}

	public getItemWithIsbn(isbn: string) {
		for (const customerItemWithItem of this._customerItemList) {
			if (
				customerItemWithItem.item.info &&
				customerItemWithItem.item.info["isbn"]
			) {
				if (
					customerItemWithItem.item.info["isbn"].toString() === isbn
				) {
					return customerItemWithItem;
				}
			}
		}
	}

	public async addItemWithIsbn(isbn: string): Promise<boolean> {
		if (this._customerItemList.length <= 0) {
			this._customerItemList = await this.getCustomerItemList();
		}

		const cartItemWithItem = this.getItemWithIsbn(isbn);

		if (cartItemWithItem) {
			if (!this._cartService.contains(cartItemWithItem.item.id)) {
				this._cartService.addCustomerItem(
					cartItemWithItem.customerItem,
					cartItemWithItem.item
				);
			}
			return true;
		}

		return false;
	}

	private handleCustomerChange() {
		this._customerService.subscribe(() => {
			this.getCustomerItemList()
				.then(customerItemList => {
					this.setCustomerItemList(customerItemList);
				})
				.catch(() => {});
		});
	}

	private handleCustomerClear() {
		this._customerService.onClear(cleared => {
			if (cleared) {
				this.setCustomerItemList([]);
			}
		});
	}

	private setCustomerItemList(customerItemList: CustomerItemWithItem[]) {
		this._customerItemList = customerItemList;
		this._customerItems$.next(customerItemList);
	}

	private async getCustomerItemList(): Promise<
		{ customerItem: CustomerItem; item: Item }[]
	> {
		const customerItemList = [];
		const customerDetail = this._customerDetailService.get();

		const customerItems = await this._customerItemService.get({
			query: `?customer=${customerDetail.id}`
		});

		for (const customerItem of customerItems) {
			if (
				!customerItem.returned &&
				!customerItem.buyout &&
				customerItem.handout
			) {
				const item = await this._itemService.getById(
					customerItem.item as string
				);
				customerItemList.push({
					customerItem: customerItem,
					item: item
				});
			}
		}

		return customerItemList;
	}
}
