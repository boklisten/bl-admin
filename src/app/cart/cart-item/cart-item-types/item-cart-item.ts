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
		//throw "itemCartItem.getAction(): is not implemented";
	}

	private calculatePriceInformation(
		cartItemAction: CartItemAction
	): PriceInformation {
		console.log("we have service??", this._itemPriceService.buyPrice);
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
				cartItemAction.period,
				1
			);
		} else if (cartItemAction.action === "partly-payment") {
			priceInformation.amount = 350;
			priceInformation.unitPrice = 350;
			priceInformation.taxRate = 0;
			priceInformation.taxAmount = 0;
			priceInformation.amountLeftToPay = 100;
			priceInformation.alreadyPayed = 0;
		} else if (cartItemAction.action === "buy") {
			priceInformation.amount = 1200;
			priceInformation.unitPrice = 800;
			priceInformation.taxRate = 0.5;
			priceInformation.taxAmount = 400;
			priceInformation.amountLeftToPay = 0;
			priceInformation.alreadyPayed = 0;
		} else if (cartItemAction.action === "sell") {
			priceInformation.amount = -150;
			priceInformation.unitPrice = -150;
			priceInformation.taxRate = 0;
			priceInformation.taxAmount = 0;
			priceInformation.amountLeftToPay = 0;
			priceInformation.alreadyPayed = 0;
		}

		return priceInformation;
	}
}
