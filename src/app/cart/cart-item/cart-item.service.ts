import { Injectable } from "@angular/core";
import { CartItem } from "./cart-item";
import { Item } from "@wizardcoder/bl-model";
import { ItemCartItem } from "./cart-item-types/item-cart-item";

@Injectable({
	providedIn: "root"
})
export class CartItemService {
	constructor() {}

	public createCartItemByItem(item: Item): CartItem {
		return new ItemCartItem(item);
	}
}
