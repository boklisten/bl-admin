import { Injectable } from "@angular/core";
import { ItemService } from "@wizardcoder/bl-connect";
import { BlApiError, Item } from "@wizardcoder/bl-model";
import { Subject, Observable } from "rxjs";
import { StorageService } from "../../storage/storage.service";
import { CartService } from "../../cart/cart.service";
import { CustomerService } from "../../customer/customer.service";
import { CustomerOrderService } from "../../order/customer-order/customer-order.service";

@Injectable()
export class ItemSearchService {
	private _searchResultError$: Subject<any>;
	private _searchResult$: Subject<boolean>;
	private _searchTerm: string;
	private _searchResult: Item[];
	private _storageSearchTermName: string;

	constructor(
		private _itemService: ItemService,
		private _cartService: CartService,
		private _storageService: StorageService,
		private _customerService: CustomerService,
		private _customerOrderService: CustomerOrderService
	) {
		this._searchResultError$ = new Subject<any>();
		this._searchResult$ = new Subject<boolean>();
		this._storageSearchTermName = "bl-item-search-term";
	}

	public async search(
		searchTerm: string,
		addToCart?: boolean
	): Promise<Item[]> {
		throw new Error("itemService.search() is not implemented");
		/*
		if (!searchTerm || searchTerm.length < 3) {
			this._searchResultError$.next(true);
			return;
		}

		this.setSearchTerm(searchTerm);

		let items: Item[] = [];

		try {
			items = await this._itemService.get({
				query: "?s=" + this._searchTerm
			});
		} catch (e) {
			try {
				items = await this._itemService.get({
					query: "?info.isbn=" + this._searchTerm
				});
			} catch (e) {
				items = [];
			}
		}

		if (items.length == 1 && addToCart) {
			if (!this._cartService.contains(items[0].id)) {
				this.addItem(items[0]);

				this.setSearchTerm("");
				return items;
			}
		}

		this.setSearchResult(items);

		return items;
    */
	}

	public addItem(item: Item) {
		throw new Error("itemService().addItem() is deprecated");
		/*
		try {
			const {
				order,
				orderItem
			} = this._customerOrderService.getOrderedItem(item.id);
			this._cartService.addOrderItem(orderItem, order, item);
			return;
		} catch (e) {}
		try {
			const customerItem = this._customerService.getActiveCustomerItem(
				item.id
			);
			this._cartService.addCustomerItem(customerItem);
			return;
		} catch (e) {}

		this._cartService.add(item);
    */
	}

	public getSearchTerm(): string {
		return this._searchTerm;
	}

	public getSearchResult(): Item[] {
		return this._searchResult;
	}

	public onSearchResult(): Observable<boolean> {
		return this._searchResult$;
	}

	public onSearchResultError(): Observable<Item[]> {
		return this._searchResultError$;
	}

	private setSearchResult(searchResult: Item[]) {
		this._searchResult = searchResult;

		if (searchResult.length > 0) {
			this._searchResult$.next(true);
		} else {
			this._searchResultError$.next(true);
		}
	}

	private setSearchTerm(searchTerm: string) {
		this._searchTerm = searchTerm;
	}
}
