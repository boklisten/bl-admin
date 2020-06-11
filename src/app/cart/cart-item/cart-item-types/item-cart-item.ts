import { CartItem } from "../cart-item";
import { Item, OrderItem } from "@wizardcoder/bl-model";
import { CartItemAction } from "../cart-item-action";

export class ItemCartItem implements CartItem {
	constructor(private _item: Item) {}

	public getPriceInformation() {
		return {
			amount: this._item.price,
			unitPrice: this._item.price,
			taxRate: this._item.taxRate,
			taxAmount: 0,
			amountLeftToPay: 230,
			alreadyPayed: 100
		};
	}

	public getTitle() {
		return this._item.title;
	}

	public createOrderItem(): OrderItem {
		throw "itemCartItem.createOrderItem(): is not implemented";
	}

	public setAction(action: CartItemAction) {
		throw "itemCartItem.setAction(): is not implemented";
	}

	public getAction(): CartItemAction {
		throw "itemCartItem.getAction(): is not implemented";
	}

	public getValidActions(): CartItemAction[] {
		throw "itemCartItem.getAction(): is not implemented";
	}
}
