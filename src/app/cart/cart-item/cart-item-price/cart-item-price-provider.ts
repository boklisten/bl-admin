import { PriceInformation } from "../../../price/price-information";
import { CartItemAction } from "../cart-item-action";
import { ItemPriceService } from "../../../price/item-price/item-price.service";
import { Item, OrderItem, Order, CustomerItem } from "@wizardcoder/bl-model";
import { OrderItemPriceService } from "../../../price/order-item-price/order-item-price.service";
import { CustomerItemPriceService } from "../../../price/customer-item-price/customer-item-price.service";
import { PriceService } from "../../../price/price.service";

export class CartItemPriceProvider {
	constructor(
		private _itemPriceService: ItemPriceService,
		private _orderItemPriceService: OrderItemPriceService,
		private _customerItemPriceService: CustomerItemPriceService,
		private _priceService: PriceService
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

	public async calculatePriceInformationForCustomerItem(
		customerItem: CustomerItem,
		item: Item,
		cartItemAction: CartItemAction
	): Promise<PriceInformation> {
		if (cartItemAction.action === "extend") {
			return this._customerItemPriceService.getExtendPriceInformation(
				customerItem,
				item,
				cartItemAction.period
			);
		} else if (cartItemAction.action === "buyback") {
			return this._customerItemPriceService.getBuybackPriceInformation(
				customerItem
			);
		} else if (cartItemAction.action === "buyout") {
			return this._customerItemPriceService.getPartlyPaymentBuyoutPriceInformation(
				customerItem,
				item
			);
		} else if (cartItemAction.action === "cancel") {
			return this._customerItemPriceService.getCancelPriceInformation(
				customerItem,
				item
			);
		}

		throw new Error(
			"could not calculate price information for customerItemCartItem"
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

		if (
			alreadyPayed &&
			this.isActionEqualToOrder(orderItem, cartItemAction)
		) {
			let priceInformation = this._priceService.getEmptyPriceInformation();
			priceInformation.alreadyPayed = orderItem.amount;
			if (orderItem.info && orderItem.info["amountLeftToPay"]) {
				priceInformation.amountLeftToPay =
					orderItem.info["amountLeftToPay"];
			}
			return priceInformation;
		}

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
				cartItemAction.age,
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

	private isActionEqualToOrder(
		orderItem: OrderItem,
		cartItemAction: CartItemAction
	): boolean {
		if (cartItemAction.action === orderItem.type) {
			if (
				orderItem.info &&
				cartItemAction.period &&
				orderItem.info["periodType"] !== cartItemAction.period
			) {
				return false;
			}
			return true;
		}
	}
}
