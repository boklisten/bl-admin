import {Injectable} from '@angular/core';
import {BlcScannerService} from '../../bl-common/blc-scanner/blc-scanner.service';
import {CustomerOrderItemListService} from '../../order/customer-order/customer-order-item-list/customer-order-item-list.service';
import {CustomerItemListService} from '../../customer-item/customer-item-list/customer-item-list.service';
import {ItemSearchService} from '../../item/item-search/item-search.service';

@Injectable({
	providedIn: 'root'
})
export class CartItemSearchService {

	constructor(private _blcScannerService: BlcScannerService,
	            private _customerItemListService: CustomerItemListService,
	            private _itemSearchService: ItemSearchService,
	            private _customerOrderItemListService: CustomerOrderItemListService) {
		this.onIsbn();
	}


	onIsbn() {
		this._blcScannerService.onIsbn().subscribe((isbn: string) => {

			this.handleIsbnScan(isbn).then((itemFound) => {

			}).catch((err) => {
				console.log('could not find item by isbn scan', err);
			});
		});
	}

	private async handleIsbnScan(isbn: string): Promise<boolean> {

		let foundItem = await this.scanForOrderItem(isbn);

		if (!foundItem) {
			foundItem = await this.scanForCustomerItem(isbn);
		}

		if (!foundItem) {
			foundItem = await this.scanForItem(isbn);
		}

		return foundItem;
	}

	private async scanForOrderItem(isbn: string): Promise<boolean> {
		return await this._customerOrderItemListService.addItemWithIsbn(isbn);
	}

	private async scanForCustomerItem(isbn: string): Promise<boolean> {
		return await this._customerItemListService.addItemWithIsbn(isbn);
	}

	private async scanForItem(isbn: string): Promise<boolean> {
		const items = await this._itemSearchService.search(isbn, true);

		return (items && items.length === 1);
	}
}
