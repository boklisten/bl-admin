import { CartItem } from "../cart-item";
import { Item } from "@wizardcoder/bl-model";

export class ItemCartItem extends CartItem {
	constructor(private _item: Item) {
		super(_item.title);
	}

	public getTitle() {
		return this._item.title;
	}

	public getPriceInformation() {
		return {
			amount: this._item.price,
			unitPrice: this._item.price,
			taxRate: this._item.taxRate,
			taxAmount: 0,
			payLater: 0
		};
	}
}
