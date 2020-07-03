import { Injectable } from "@angular/core";
import { CustomerItemListService } from "../../customer-item/customer-item-list/customer-item-list.service";
import { CartItem } from "../../cart/cart-item/cart-item";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { UniqueItem } from "@wizardcoder/bl-model";
import { CartService } from "../../cart/cart.service";
import { CustomerOrderItemListService } from "../../order/customer-order/customer-order-item-list/customer-order-item-list.service";

@Injectable({
	providedIn: "root"
})
export class UniqueItemScanToCartService {
	constructor(
		private _customerItemListService: CustomerItemListService,
		private _cartItemService: CartItemService,
		private _cartService: CartService,
		private _customerOrderItemList: CustomerOrderItemListService
	) {}

	public async addUniqueItemToCart(uniqueItem: UniqueItem): Promise<boolean> {
		// check if custmerItemList has BLID
		// if BLID is present, add to cart
		// if BLID is NOT present, check orderItems for itemID
		// if itemID is present, add to cart
		// if itemID is NOT present, create a new cartItem with item
		let cartItem: CartItem;

		try {
			cartItem = await this.createCartItemFromCustomerItemList(
				uniqueItem
			);
		} catch (e) {
			try {
				cartItem = await this.createCartItemFromCustomerOrderItemList(
					uniqueItem
				);
			} catch (e) {
				cartItem = await this._cartItemService.createCartItemByUniqueItem(
					uniqueItem
				);
			}
		}

		cartItem.setBLID(uniqueItem.blid);
		this._cartService.add(cartItem);

		return true;
	}

	private async createCartItemFromCustomerOrderItemList(
		uniqueItem: UniqueItem
	): Promise<CartItem> {
		let customerOrderItem;

		try {
			customerOrderItem = this._customerOrderItemList.getByItemId(
				uniqueItem.item
			);
		} catch (e) {
			throw e;
		}

		return this._cartItemService.createCartItemByOrderItem(
			customerOrderItem.orderItem,
			customerOrderItem.order
		);
	}

	private async createCartItemFromCustomerItemList(
		uniqueItem: UniqueItem
	): Promise<CartItem> {
		let customerItemWithItem;

		try {
			customerItemWithItem = this._customerItemListService.getByUniqueItem(
				uniqueItem
			);
		} catch (e) {
			console.log("could not create CartItem", e);
		}

		return this._cartItemService.createCartItemByCustomerItem(
			customerItemWithItem.customerItem
		);
	}
}
