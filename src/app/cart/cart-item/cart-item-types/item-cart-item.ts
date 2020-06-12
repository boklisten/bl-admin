import { CartItem } from "../cart-item";
import { Item, OrderItem } from "@wizardcoder/bl-model";
import { CartItemAction } from "../cart-item-action";
import { PriceInformation } from "../../../price/price-information";
import { Subscribable } from "../../../bl-common/subscribable/subscribable";
import { ItemPriceService } from "../../../price/item-price/item-price.service";
import { BranchItemHelperService } from "../../../branch/branch-item-helper/branch-item-helper.service";
import { CartItemActionProvider } from "../cart-item-action/cart-item-action-provider";
import { CartItemPriceProvider } from "../cart-item-price/cart-item-price-provider";

export class ItemCartItem extends Subscribable implements CartItem {
	private _action: CartItemAction;
	private _cartItemActionProvider: CartItemActionProvider;
	private _cartItemPriceProvider: CartItemPriceProvider;

	constructor(
		private _item: Item,
		private _itemPriceService: ItemPriceService,
		private _branchItemHelperService: BranchItemHelperService
	) {
		super();
		this._cartItemActionProvider = new CartItemActionProvider(
			this._branchItemHelperService
		);
		this._cartItemPriceProvider = new CartItemPriceProvider(
			this._itemPriceService
		);
		this.setAction(this.getValidActions()[0]);
	}

	public getPriceInformation() {
		return this.calculatePriceInformation(this._action);
	}

	public getTitle() {
		return this._item.title;
	}

	public createOrderItem(): OrderItem {
		throw "itemCartItem.createOrderItem(): is not implemented";
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

	private calculatePriceInformation(
		cartItemAction: CartItemAction
	): PriceInformation {
		return this._cartItemPriceProvider.calculatePriceInformationForItem(
			this._item,
			cartItemAction
		);
	}
}
