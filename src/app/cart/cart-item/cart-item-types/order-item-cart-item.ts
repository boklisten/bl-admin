import { CartItem } from "../cart-item";
import { Subscribable } from "../../../bl-common/subscribable/subscribable";
import { PriceInformation } from "../../../price/price-information";
import { OrderItem, Item, Order } from "@boklisten/bl-model";
import { CartItemAction } from "../cart-item-action";
import { CartItemPriceProvider } from "../cart-item-price/cart-item-price-provider";
import { CartItemOrderItemProvider } from "../cart-item-order-item/cart-item-order-item-provider";
import { CartItemActionProvider } from "../cart-item-action/cart-item-action-provider";

export class OrderItemCartItem extends Subscribable implements CartItem {
	private _action: CartItemAction;
	private _blid: string;

	constructor(
		private _orderItem: OrderItem,
		private _item: Item,
		private _order: Order,
		private _cartItemPriceProvider: CartItemPriceProvider,
		private _cartItemActionProvider: CartItemActionProvider,
		private _cartItemOrderItemProvider: CartItemOrderItemProvider
	) {
		super();
		this.setDefaultAction();
	}

	public async getPriceInformation(): Promise<PriceInformation> {
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
		return this._orderItem ? (this._orderItem.item as string) : null;
	}

	public getDeliveryId(): string {
		return this._order.delivery as string;
	}

	public getCustomerItemId(): string {
		return null;
	}

	public getMovedFromOrderId(): string {
		return this._order.id;
	}

	public async createOrderItem(): Promise<OrderItem> {
		return this._cartItemOrderItemProvider.createOrderItem(this);
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
	}

	public setBLID(blid: string) {
		this._blid = blid;
	}

	public getBLID(): string {
		return this._blid;
	}

	public getISBN(): number {
		if (this._item && this._item.info) {
			return this._item.info.isbn;
		}

		return null;
	}
	public getItem(): Item {
		return this._item;
	}

	private setDefaultAction() {
		const defaultAction = this.getDefaultAction(this.getValidActions());
		this.setAction(defaultAction);
	}

	private getDefaultAction(
		allValidActions: CartItemAction[]
	): CartItemAction {
		for (let action of allValidActions) {
			if (action.action === this._orderItem.type) {
				if (
					this._orderItem.info &&
					action.period &&
					this._orderItem.info["periodType"] !== action.period
				) {
					continue;
				}
				return action;
			}
		}

		return allValidActions[0];
	}
}
