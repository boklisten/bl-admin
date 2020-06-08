import { Injectable } from "@angular/core";
import { CustomerItem, Item } from "@wizardcoder/bl-model";
import { CustomerService } from "../../customer/customer.service";
import { CustomerItemService, ItemService } from "@wizardcoder/bl-connect";
import { CartService } from "../../cart/cart.service";
import { Observable } from "rxjs/internal/Observable";
import { Subject } from "rxjs/internal/Subject";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";

@Injectable({
	providedIn: "root"
})
export class CustomerItemListService {
	private _customerItemList: { customerItem: CustomerItem; item: Item }[];
	private _wait$: Subject<boolean>;

	constructor(
		private _customerService: CustomerService,
		private _itemService: ItemService,
		private _cartService: CartService,
		private _customerItemService: CustomerItemService,
		private _customerDetailService: CustomerDetailService
	) {
		this._customerItemList = [];
		this._wait$ = new Subject<boolean>();
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

	public onWait(): Observable<boolean> {
		return this._wait$.asObservable();
	}

	public async addItemWithIsbn(isbn: string): Promise<boolean> {
		if (this._customerItemList.length <= 0) {
			this._customerItemList = await this.getCustomerItems();
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

	public async getCustomerItems(): Promise<
		{ customerItem: CustomerItem; item: Item }[]
	> {
		const customerItemList = [];
		const customerDetail = this._customerDetailService.get();
		this._wait$.next(true);

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

		this._wait$.next(false);
		return customerItemList;
	}
}
