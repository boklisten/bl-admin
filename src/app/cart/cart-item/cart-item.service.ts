import { Injectable } from "@angular/core";
import { CartItem } from "./cart-item";
import {
	Item,
	OrderItem,
	Order,
	CustomerItem,
	UniqueItem,
} from "@boklisten/bl-model";
import { ItemCartItem } from "./cart-item-types/item-cart-item";
import { ItemPriceService } from "../../price/item-price/item-price.service";
import { BranchItemHelperService } from "../../branch/branch-item-helper/branch-item-helper.service";
import { OrderItemCartItem } from "./cart-item-types/order-item-cart-item";
import { CustomerItemCartItem } from "./cart-item-types/customer-item-cart-item";
import { OrderItemPriceService } from "../../price/order-item-price/order-item-price.service";
import { CartItemPriceProvider } from "./cart-item-price/cart-item-price-provider";
import { CartItemActionProvider } from "./cart-item-action/cart-item-action-provider";
import { CartItemOrderItemProvider } from "./cart-item-order-item/cart-item-order-item-provider";
import { ItemService } from "@boklisten/bl-connect";
import { CustomerItemPriceService } from "../../price/customer-item-price/customer-item-price.service";
import { BranchHelperService } from "../../branch/branch-helper/branch-helper.service";
import { PriceService } from "../../price/price.service";
import { DateService } from "../../date/date.service";
import { CustomerService } from "../../customer/customer.service";
import { AuthService } from "../../auth/auth.service";

@Injectable({
	providedIn: "root",
})
export class CartItemService {
	private _cartItemPriceProvider: CartItemPriceProvider;
	private _cartItemActionProvider: CartItemActionProvider;
	private _cartItemOrderItemProvider: CartItemOrderItemProvider;

	constructor(
		private _itemPriceService: ItemPriceService,
		private _branchItemHelperService: BranchItemHelperService,
		private _orderItemPriceService: OrderItemPriceService,
		private _itemService: ItemService,
		private _customerItemPriceService: CustomerItemPriceService,
		private _branchHelperService: BranchHelperService,
		private _priceService: PriceService,
		private _dateService: DateService,
		private _customerService: CustomerService,
		private _authService: AuthService
	) {
		this._cartItemPriceProvider = new CartItemPriceProvider(
			this._itemPriceService,
			this._orderItemPriceService,
			this._customerItemPriceService,
			this._priceService
		);
		this._cartItemActionProvider = new CartItemActionProvider(
			this._branchItemHelperService,
			this._branchHelperService,
			this._dateService,
			this._customerService,
			this._authService
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

	public async createCartItemByCustomerItem(
		customerItem: CustomerItem
	): Promise<CartItem> {
		let item: Item;

		try {
			item = await this._itemService.getById(customerItem.item as string);
		} catch (e) {
			throw new Error("could not get item");
		}

		return new CustomerItemCartItem(
			customerItem,
			item,
			this._cartItemPriceProvider,
			this._cartItemActionProvider,
			this._cartItemOrderItemProvider
		);
	}

	public async createCartItemByUniqueItem(
		uniqueItem: UniqueItem
	): Promise<CartItem> {
		let item: Item;
		let cartItem: CartItem;

		try {
			item = await this._itemService.getById(uniqueItem.item);
			cartItem = await this.createCartItemByItem(item);
		} catch (e) {
			throw Error("could not get item");
		}

		cartItem.setBLID(uniqueItem.blid);
		return cartItem;
	}
}
