import { Injectable } from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { CustomerOrderItemListService } from "../../order/customer-order/customer-order-item-list/customer-order-item-list.service";
import { CustomerItemListService } from "../../customer-item/customer-item-list/customer-item-list.service";
import { ItemSearchService } from "../../item/item-search/item-search.service";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { CustomerService } from "../../customer/customer.service";

@Injectable({
	providedIn: "root",
})
export class CartItemSearchService {
	private _searching$: Subject<boolean>;

	constructor(
		private _blcScannerService: BlcScannerService,
		private _customerItemListService: CustomerItemListService,
		private _itemSearchService: ItemSearchService,
		private _customerService: CustomerService,
		private _customerOrderItemListService: CustomerOrderItemListService
	) {
		this.onIsbn();
		this._searching$ = new Subject<boolean>();
	}

	public onSearching(): Observable<boolean> {
		return this._searching$.asObservable();
	}

	private onIsbn() {
		this._blcScannerService.onIsbn((isbn: number) => {
			this._searching$.next(true);

			this.handleIsbnScan(isbn)
				.then((itemFound) => {
					this._searching$.next(false);
				})
				.catch((err) => {
					console.log("could not find item by isbn scan", err);
				});
		});
	}

	private async handleIsbnScan(isbn: number): Promise<boolean> {
		let foundItem = await this.scanForOrderItem(isbn);

		if (!foundItem) {
			foundItem = await this.scanForCustomerItem(isbn);
		}

		if (!foundItem) {
			foundItem = await this.scanForItem(isbn);
		}

		return foundItem;
	}

	private async scanForOrderItem(isbn: number): Promise<boolean> {
		throw "cartItemSearchService.scanForOrderItem(): not implemented";
	}

	private async scanForCustomerItem(isbn: number): Promise<boolean> {
		throw "cartItemSearchService.scanForCustomerItem(): not implemented";
	}

	private async scanForItem(isbn: number): Promise<boolean> {
		throw "cartItemSearchService.scanForItem(): not implemented";
		/*
		const items = await this._itemSearchService.search(isbn, true);

		return items && items.length === 1;
    */
	}
}
