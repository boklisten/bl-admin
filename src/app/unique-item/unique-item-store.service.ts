import { Injectable } from "@angular/core";
import { UniqueItem, Item } from "@wizardcoder/bl-model";
import { UniqueItemService } from "@wizardcoder/bl-connect";

@Injectable({
	providedIn: "root"
})
export class UniqueItemStoreService {
	constructor(private _uniqueItemService: UniqueItemService) {}

	public async createAndAdd(blid: string, item: Item): Promise<UniqueItem> {
		const uniqueItem = this.createUniqueItem(blid, item);

		try {
			const addedUniqueItem = await this._uniqueItemService.add(
				uniqueItem
			);
			return addedUniqueItem;
		} catch (e) {
			throw e;
		}
	}

	public async get(blid: string): Promise<UniqueItem> {
		try {
			const uniqueItems = await this._uniqueItemService.get({
				query: `?blid=${blid}`
			});
			return uniqueItems[0];
		} catch (e) {
			throw e;
		}
	}

	public async checkIfAlreadyAdded(
		blids: string[]
	): Promise<{ [blid: string]: UniqueItem }> {
		let alreadyAddedUniqueItems = {};

		for (let blid of blids) {
			try {
				const uniqueItem = await this.get(blid);
				alreadyAddedUniqueItems[blid] = uniqueItem;
			} catch (e) {
				alreadyAddedUniqueItems[blid] = null;
			}
		}

		return alreadyAddedUniqueItems;
	}

	public createUniqueItem(blid: string, item: Item): UniqueItem {
		return {
			id: "",
			blid: blid,
			item: item.id,
			title: item.title
		};
	}
}
