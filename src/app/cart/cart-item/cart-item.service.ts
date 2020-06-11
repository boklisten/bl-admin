import { Injectable } from "@angular/core";
import { CartItem } from "./cart-item";
import { Item } from "@wizardcoder/bl-model";
import { ItemCartItem } from "./cart-item-types/item-cart-item";
import { ItemPriceService } from "../../price/item-price/item-price.service";

@Injectable({
	providedIn: "root"
})
export class CartItemService {
	constructor(private _itemPriceService: ItemPriceService) {}

	public createCartItemByItem(item: Item): CartItem {
		return new ItemCartItem(item, this._itemPriceService);
	}
}
