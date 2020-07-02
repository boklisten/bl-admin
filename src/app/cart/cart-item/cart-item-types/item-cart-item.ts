import { CartItem } from "../cart-item";
import { Item, OrderItem } from "@wizardcoder/bl-model";
import { CartItemAction } from "../cart-item-action";
import { PriceInformation } from "../../../price/price-information";
import { Subscribable } from "../../../bl-common/subscribable/subscribable";
import { ItemPriceService } from "../../../price/item-price/item-price.service";
import { BranchItemHelperService } from "../../../branch/branch-item-helper/branch-item-helper.service";
import { CartItemActionProvider } from "../cart-item-action/cart-item-action-provider";
import { CartItemPriceProvider } from "../cart-item-price/cart-item-price-provider";
import { CartItemOrderItemProvider } from "../cart-item-order-item/cart-item-order-item-provider";

export class ItemCartItem extends Subscribable implements CartItem {
	private _action: CartItemAction;
	private _blid: string;

	constructor(
		private _item: Item,
		private _cartItemPriceProvider: CartItemPriceProvider,
		private _cartItemActionProvider: CartItemActionProvider,
		private _cartItemOrderItemProvider: CartItemOrderItemProvider
	) {
		super();
		this.setAction(this.getValidActions()[0]);
	}

	public async getPriceInformation(): Promise<PriceInformation> {
		return this._cartItemPriceProvider.calculatePriceInformationForItem(
			this._item,
			this._action
		);
	}

	public getTitle() {
		return this._item.title;
	}

	public getItemId() {
		return this._item ? this._item.id : null;
	}

	public getCustomerItemId(): string {
		return null;
	}

	public getMovedFromOrderId(): string {
		return null;
	}

	public async createOrderItem(): Promise<OrderItem> {
		return await this._cartItemOrderItemProvider.createOrderItem(this);
	}

	public setAction(action: CartItemAction) {
		this._action = action;
		this.notify();
	}

	public getAction(): CartItemAction {
		return this._action;
	}

	public getValidActions(): CartItemAction[] {
		return this._cartItemActionProvider.getValidActionsForItem(this._item);
	}

	public setBLID(blid: string) {
		this._blid = blid;
	}

	public getBLID(): string {
		return this._blid;
	}

	public getISBN(): string {
		if (this._item && this._item.info) {
			return this._item.info.isbn;
		}

		return "";
	}
}
