import { PriceInformation } from "../../../price/price-information";
import { CartItemAction } from "../cart-item-action";
import { ItemPriceService } from "../../../price/item-price/item-price.service";
import { Item } from "@wizardcoder/bl-model";

export class CartItemPriceProvider {
	constructor(private _itemPriceService: ItemPriceService) {}

	public calculatePriceInformationForItem(
		item: Item,
		cartItemAction: CartItemAction
	): PriceInformation {
		if (cartItemAction.action === "rent") {
			return this._itemPriceService.getRentPriceInformation(
				item,
				cartItemAction.period
			);
		} else if (cartItemAction.action === "partly-payment") {
			return this._itemPriceService.getPartlyPaymentPriceInformation(
				item,
				cartItemAction.period,
				"new"
			);
		} else if (cartItemAction.action === "buy") {
			return this._itemPriceService.getBuyPriceInformation(item);
		} else if (cartItemAction.action === "sell") {
			return this._itemPriceService.getSellPriceInformation(item);
		}

		throw new Error(
			"could not calculate price information for itemCartItem"
		);
	}
}
