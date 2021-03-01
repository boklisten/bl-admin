import { Injectable } from "@angular/core";
import { BlcScannerService } from "../../bl-common/blc-scanner/blc-scanner.service";
import { CartService } from "../../cart/cart.service";
import { CartItemService } from "../../cart/cart-item/cart-item.service";
import { ItemStoreService } from "../../item/item-store/item-store.service";
import { CartItem } from "../../cart/cart-item/cart-item";
import { CustomerOrderItemListService } from "../../order/customer-order/customer-order-item-list/customer-order-item-list.service";
import { CustomerItemListService } from "../../customer-item/customer-item-list/customer-item-list.service";
import { Item } from "@boklisten/bl-model";
import { ToasterService } from "../../toaster/toaster.service";

@Injectable({
	providedIn: "root",
})
export class IsbnScannerService {
	constructor(
		private _blcScannerService: BlcScannerService,
		private _cartService: CartService,
		private _cartItemService: CartItemService,
		private _itemStoreService: ItemStoreService,
		private _customerOrderItemList: CustomerOrderItemListService,
		private _customerItemListService: CustomerItemListService,
		private _toasterService: ToasterService
	) {}

	public async addCartItemByIsbn(isbn: number): Promise<boolean> {
		let cartItem;

		try {
			cartItem = await this.createCartItemFromCustomerItemList(isbn);
		} catch (error) {
			let item;
			try {
				item = await this._itemStoreService.fetchByIsbn(isbn);
			} catch (e) {
				throw e;
			}

			try {
				cartItem = await this.createCartItemFromCustomerOrderItemList(
					item
				);
			} catch (err) {
				cartItem = this._cartItemService.createCartItemByItem(item);
			}
		}

		if (this._cartService.contains(cartItem)) {
			this._toasterService.add("CART-CONTAINS", {
				id: cartItem.getISBN(),
				title: cartItem.getTitle(),
			});
		} else {
			this._cartService.add(cartItem);
		}

		return true;
	}

	private async createCartItemFromCustomerOrderItemList(
		item: Item
	): Promise<CartItem> {
		let customerOrderItem;

		try {
			customerOrderItem = this._customerOrderItemList.getByItemId(
				item.id
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
		isbn: number
	): Promise<CartItem> {
		let customerItemWithItem;

		try {
			customerItemWithItem = this._customerItemListService.getByISBN(
				isbn
			);
		} catch (e) {
			console.log("could not create CartItem", e);
		}

		return this._cartItemService.createCartItemByCustomerItem(
			customerItemWithItem.customerItem
		);
	}
}
