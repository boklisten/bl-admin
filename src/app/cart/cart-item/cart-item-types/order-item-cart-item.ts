import { CartItem } from "../cart-item";
import { Subscribable } from "../../../bl-common/subscribable/subscribable";
import { PriceInformation } from "../../../price/price-information";
import { OrderItem, Item, Order } from "@wizardcoder/bl-model";
import { CartItemAction } from "../cart-item-action";
import { CartItemPriceProvider } from "../cart-item-price/cart-item-price-provider";
import { CartItemOrderItemProvider } from "../cart-item-order-item/cart-item-order-item-provider";
import { CartItemActionProvider } from "../cart-item-action/cart-item-action-provider";

export class OrderItemCartItem extends Subscribable implements CartItem {
	private _action: CartItemAction;

	constructor(
		private _orderItem: OrderItem,
		private _item: Item,
		private _order: Order,
		private _cartItemPriceProvider: CartItemPriceProvider,
		private _cartItemActionProvider: CartItemActionProvider,
		private _cartItemOrderItemProvider: CartItemOrderItemProvider
	) {
		super();
		this.setAction(this.getValidActions()[0]);
	}

	public getPriceInformation(): PriceInformation {
		return this._cartItemPriceProvider.calculatePriceInformationForOrderItem(
			this._orderItem,
			this._order,
			this._item,
			this._action
		);
	}

	public getTitle(): string {
		return this._orderItem.title;
	}

	public getItemId(): string {
		return this._orderItem.item as string;
	}

	public createOrderItem(): OrderItem {
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
		return this._cartItemActionProvider.getValidActionsForOrderItem(
			this._orderItem,
			this._item
		);
		//throw "not implemented";
	}
}
