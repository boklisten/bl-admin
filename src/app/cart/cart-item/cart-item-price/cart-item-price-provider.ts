import { PriceInformation } from "../../../price/price-information";
import { CartItemAction } from "../cart-item-action";
import { ItemPriceService } from "../../../price/item-price/item-price.service";
import { Item, OrderItem, Order } from "@wizardcoder/bl-model";
import { OrderItemPriceService } from "../../../price/order-item-price/order-item-price.service";

export class CartItemPriceProvider {
	constructor(
		private _itemPriceService: ItemPriceService,
		private _orderItemPriceService: OrderItemPriceService
	) {}

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

	public calculatePriceInformationForOrderItem(
		orderItem: OrderItem,
		order: Order,
		item: Item,
		cartItemAction: CartItemAction
	): PriceInformation {
		const alreadyPayed = this._orderItemPriceService.alreadyPayed(
			orderItem,
			order
		)
			? true
			: false;
		if (cartItemAction.action === "rent") {
			return this._orderItemPriceService.getRentPriceInformation(
				orderItem,
				item,
				cartItemAction.period,
				alreadyPayed
			);
		} else if (cartItemAction.action === "partly-payment") {
			return this._orderItemPriceService.getPartlyPaymentPriceInformation(
				orderItem,
				item,
				cartItemAction.period,
				"new",
				alreadyPayed
			);
		} else if (cartItemAction.action === "buy") {
			return this._orderItemPriceService.getBuyPriceInformation(
				orderItem,
				item,
				alreadyPayed
			);
		} else if (cartItemAction.action === "cancel") {
			return this._orderItemPriceService.getCancelPriceInformation(
				orderItem,
				alreadyPayed
			);
		}
	}
}
