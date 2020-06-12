import { Injectable } from "@angular/core";
import { CartItem } from "./cart-item";
import { Item, OrderItem, Order } from "@wizardcoder/bl-model";
import { ItemCartItem } from "./cart-item-types/item-cart-item";
import { ItemPriceService } from "../../price/item-price/item-price.service";
import { BranchItemHelperService } from "../../branch/branch-item-helper/branch-item-helper.service";
import { OrderItemCartItem } from "./cart-item-types/order-item-cart-item";
import { OrderItemPriceService } from "../../price/order-item-price/order-item-price.service";
import { CartItemPriceProvider } from "./cart-item-price/cart-item-price-provider";
import { CartItemActionProvider } from "./cart-item-action/cart-item-action-provider";
import { CartItemOrderItemProvider } from "./cart-item-order-item/cart-item-order-item-provider";
import { ItemService } from "@wizardcoder/bl-connect";

@Injectable({
	providedIn: "root"
})
export class CartItemService {
	private _cartItemPriceProvider: CartItemPriceProvider;
	private _cartItemActionProvider: CartItemActionProvider;
	private _cartItemOrderItemProvider: CartItemOrderItemProvider;

	constructor(
		private _itemPriceService: ItemPriceService,
		private _branchItemHelperService: BranchItemHelperService,
		private _orderItemPriceService: OrderItemPriceService,
		private _itemService: ItemService
	) {
		this._cartItemPriceProvider = new CartItemPriceProvider(
			this._itemPriceService,
			this._orderItemPriceService
		);
		this._cartItemActionProvider = new CartItemActionProvider(
			this._branchItemHelperService
		);
		this._cartItemOrderItemProvider = new CartItemOrderItemProvider();
	}

	public createCartItemByItem(item: Item): CartItem {
		return new ItemCartItem(
			item,
			this._cartItemPriceProvider,
			this._cartItemActionProvider,
			this._cartItemOrderItemProvider
		);
	}

	public async createCartItemByOrderItem(
		orderItem: OrderItem,
		order: Order
	): Promise<CartItem> {
		let item: Item;

		try {
			item = await this._itemService.getById(orderItem.item as string);
		} catch (e) {
			throw new Error("could not get item");
		}

		return new OrderItemCartItem(
			orderItem,
			item,
			order,
			this._cartItemPriceProvider,
			this._cartItemActionProvider,
			this._cartItemOrderItemProvider
		);
	}
}
