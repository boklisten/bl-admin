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
	private _blid: string;

	constructor(
		private _customerItem: CustomerItem,
		private _item: Item,
		private _cartItemPriceProvider: CartItemPriceProvider,
		private _cartItemActionProvider: CartItemActionProvider,
		private _cartItemOrderItemProvider: CartItemOrderItemProvider
	) {
		super();
		this.setAction(
			this._cartItemActionProvider.selectDefaultActionForCustomerItem(
				this.getValidActions(),
				this._customerItem
			)
		);
		this.setBLID(this._customerItem.blid);
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
		return this._customerItem ? (this._customerItem.item as string) : null;
	}

	public getCustomerItemId(): string {
		return this._customerItem.id;
	}

	public getMovedFromOrderId(): string {
		return null;
	}

	public async createOrderItem(): Promise<OrderItem> {
		return this._cartItemOrderItemProvider.createOrderItem(this);
	}

	public getDeliveryId(): string {
		return null;
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
}
