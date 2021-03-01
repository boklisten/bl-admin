import { Injectable } from "@angular/core";
import { Item } from "@boklisten/bl-model";
import { ItemService } from "@boklisten/bl-connect";

@Injectable({
	providedIn: "root",
})
export class ItemStoreService {
	constructor(private _itemService: ItemService) {}

	public async fetchByIsbn(isbn: number): Promise<Item> {
		try {
			let items = await this._itemService.get({
				query: `?info.isbn=${isbn}`,
			});
			return items[0];
		} catch (e) {
			throw e;
		}
	}
}
