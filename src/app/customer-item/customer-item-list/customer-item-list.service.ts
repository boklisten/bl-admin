import { Injectable } from "@angular/core";
import { CustomerItem, Item, UniqueItem } from "@wizardcoder/bl-model";
import { CustomerService } from "../../customer/customer.service";
import { CustomerItemService, ItemService } from "@wizardcoder/bl-connect";
import { ReplaySubject, Subscription } from "rxjs";

type CustomerItemWithItem = {
	customerItem: CustomerItem;
	item: Item;
};

@Injectable({
	providedIn: "root"
})
export class CustomerItemListService {
	private _customerItemList: { customerItem: CustomerItem; item: Item }[];
	private _customerItemList$: ReplaySubject<CustomerItemWithItem[]>;
	private _wait$: ReplaySubject<boolean>;

	constructor(
		private _customerService: CustomerService,
		private _itemService: ItemService,
		private _customerItemService: CustomerItemService
	) {
		this._wait$ = new ReplaySubject(1);
		this._customerItemList = [];
		this._customerItemList$ = new ReplaySubject(1);

		this.handleCustomerChange();
		this.handleCustomerClear();
		this._customerItemList$.next([]);
		this.handleCustomerWaitChange();
	}

	public subscribe(
		func: (customerItems: CustomerItemWithItem[]) => void
	): Subscription {
		return this._customerItemList$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public getByCustomerItemId(customerItemId: string): CustomerItemWithItem {
		for (let customerItemWithItem of this._customerItemList) {
			if (customerItemWithItem.customerItem.id === customerItemId) {
				return customerItemWithItem;
			}
		}
		throw new ReferenceError(
			"customerItem.id does not exist in customerItemList"
		);
	}

	public getByUniqueItem(uniqueItem: UniqueItem): CustomerItemWithItem {
		let customerItemWithItem;

		try {
			customerItemWithItem = this.getByBLID(uniqueItem.blid);
		} catch (e) {
			throw e;
		}

		return customerItemWithItem;
	}

	public getByBLID(blid: string): CustomerItemWithItem {
		for (let customerItemWithItem of this._customerItemList) {
			if (customerItemWithItem.customerItem.blid === blid) {
				return customerItemWithItem;
			}
		}
		throw new ReferenceError(`blid ${blid} not found`);
	}

	public getByISBN(isbn: number): CustomerItemWithItem {
		for (let customerItemWithItem of this._customerItemList) {
			if (customerItemWithItem.item.info.isbn === isbn) {
				return customerItemWithItem;
			}
		}

		throw new ReferenceError(`isbn ${isbn} not found`);
	}

	public getByItemId(itemId: string): CustomerItemWithItem {
		for (let customerItemWithItem of this._customerItemList) {
			if (customerItemWithItem.item.id === itemId) {
				return customerItemWithItem;
			}
		}
		throw new ReferenceError(`item id ${itemId} not found`);
	}

	private handleCustomerWaitChange() {
		this._customerService.onWait(wait => {
			if (wait) {
				this._wait$.next(wait);
			}
		});
	}

	private handleCustomerChange() {
		this._customerService.subscribe(customerDetail => {
			this._wait$.next(true);
			this.fetchCustomerItemList(customerDetail.id)
				.then(customerItemList => {
					this.setCustomerItemList(customerItemList);
				})
				.catch(() => {
					this.setCustomerItemList([]);
				});
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
		this._customerItemList$.next(customerItemList);
		this._wait$.next(false);
	}

	private async fetchCustomerItemList(
		customerDetailId: string
	): Promise<CustomerItemWithItem[]> {
		let customerItemList: CustomerItemWithItem[] = [];
		try {
			const customerItems = await this.fetchCustomerItems(
				customerDetailId
			);
			customerItemList = await this.fetchAndAttachItemsToCustomerItems(
				customerItems
			);
		} catch (e) {
			return [];
		}

		return customerItemList;
	}

	private async fetchCustomerItems(
		customerDetailId: string
	): Promise<CustomerItem[]> {
		let customerItems;

		try {
			customerItems = await this._customerItemService.get({
				query: `?customer=${customerDetailId}`
			});
		} catch (e) {
			return [];
		}

		return customerItems;
	}

	private async fetchAndAttachItemsToCustomerItems(
		customerItems: CustomerItem[]
	): Promise<CustomerItemWithItem[]> {
		const customerItemList = [];

		for (const customerItem of customerItems) {
			if (this.isActive(customerItem)) {
				const item = await this.fetchItem(customerItem.item as string);

				customerItemList.push({
					customerItem: customerItem,
					item: item
				});
			}
		}

		return customerItemList;
	}

	private async fetchItem(itemId: string): Promise<Item> {
		return this._itemService.getById(itemId);
	}

	private isActive(customerItem: CustomerItem): boolean {
		return (
			!customerItem.returned &&
			!customerItem.buyout &&
			customerItem.handout
		);
	}
}
