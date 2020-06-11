import { CartItem } from "../cart-item";
import { Item, OrderItem } from "@wizardcoder/bl-model";
import { CartItemAction } from "../cart-item-action";
import { PriceInformation } from "../../../price/price-information";
import { Subscribable } from "../../../bl-common/subscribable/subscribable";
import { ItemPriceService } from "../../../price/item-price/item-price.service";

export class ItemCartItem extends Subscribable implements CartItem {
	private _action: CartItemAction;

	constructor(
		private _item: Item,
		private _itemPriceService: ItemPriceService
	) {
		super();
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
		return [
			{
				action: "rent",
				period: "semester",
				deadline: new Date(2020, 6, 1)
			},
			{ action: "rent", period: "year", deadline: new Date(2021, 6, 1) },
			{
				action: "partly-payment",
				period: "semester",
				deadline: new Date(2020, 6, 1)
			},
			{
				action: "partly-payment",
				period: "year",
				deadline: new Date(2021, 6, 1)
			},
			{ action: "buy" },
			{ action: "sell" }
		];
	}

	private calculatePriceInformation(
		cartItemAction: CartItemAction
	): PriceInformation {
		let priceInformation: PriceInformation = {
			amount: 0,
			unitPrice: 0,
			taxRate: 0,
			taxAmount: 0,
			amountLeftToPay: 0,
			alreadyPayed: 0
		};

		if (cartItemAction.action === "rent") {
			return this._itemPriceService.getRentPriceInformation(
				this._item,
				cartItemAction.period
			);
		} else if (cartItemAction.action === "partly-payment") {
			return this._itemPriceService.getPartlyPaymentPriceInformation(
				this._item,
				this._action.period,
				"new"
			);
		} else if (cartItemAction.action === "buy") {
			return this._itemPriceService.getBuyPriceInformation(this._item);
		} else if (cartItemAction.action === "sell") {
			return this._itemPriceService.getSellPriceInformation(this._item);
		}

		return priceInformation;
	}
}
