import { CartItem } from "../cart-item";
import { Subscribable } from "../../../bl-common/subscribable/subscribable";
import { CartItemAction } from "../cart-item-action";
import { PriceInformation } from "../../../price/price-information";
import { OrderItem, CustomerItem, Item } from "@wizardcoder/bl-model";
import { CartItemActionProvider } from "../cart-item-action/cart-item-action-provider";
import { CartItemPriceProvider } from "../cart-item-price/cart-item-price-provider";
import { CartItemOrderItemProvider } from "../cart-item-order-item/cart-item-order-item-provider";

export class CustomerItemCartItem extends Subscribable implements CartItem {
	private _action: CartItemAction;

	constructor(
		private _customerItem: CustomerItem,
		private _item: Item,
		private _cartItemPriceProvider: CartItemPriceProvider,
		private _cartItemActionProvider: CartItemActionProvider,
		private _cartItemOrderItemProvider: CartItemOrderItemProvider
	) {
		super();
		this.setAction(this.getValidActions()[0]);
	}

	public async getPriceInformation(): Promise<PriceInformation> {
		return this._cartItemPriceProvider.calculatePriceInformationForCustomerItem(
			this._customerItem,
			this._item,
			this._action
		);
	}

	public getTitle(): string {
		return this._item.title;
	}

	public getItemId(): string {
		return this._customerItem.item as string;
	}

	public async createOrderItem(): Promise<OrderItem> {
		throw "not implemented";
	}

	public setAction(action: CartItemAction) {
		this._action = action;
		this.notify();
	}
	public getAction(): CartItemAction {
		return this._action;
	}

	public getValidActions(): CartItemAction[] {
		return this._cartItemActionProvider.getValidActionsForCustomerItem(
			this._customerItem,
			this._item
		);
	}
}
