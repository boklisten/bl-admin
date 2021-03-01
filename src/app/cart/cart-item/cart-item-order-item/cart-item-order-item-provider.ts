import { OrderItem } from "@boklisten/bl-model";
import { CartItem } from "../cart-item";
import { PriceInformation } from "../../../price/price-information";

export class CartItemOrderItemProvider {
	public async createOrderItem(cartItem: CartItem): Promise<OrderItem> {
		const priceInformation = await cartItem.getPriceInformation();
		const cartItemAction = cartItem.getAction();

		return {
			type: cartItemAction.action as any,
			item: cartItem.getItemId(),
			title: cartItem.getTitle(),
			blid: cartItem.getBLID(),
			age: cartItemAction.age ? cartItemAction.age : null,
			amount: priceInformation.amount,
			unitPrice: priceInformation.unitPrice,
			taxRate: priceInformation.taxRate,
			taxAmount: priceInformation.taxAmount,
			handout: true,
			info: this.generateOrderItemInfo(cartItem, priceInformation),
			discount: null,
			delivered: true,
			customerItem: cartItem.getCustomerItemId(),
			match: null,
			movedToOrder: null,
			movedFromOrder: cartItem.getMovedFromOrderId(),
		};
	}

	private generateOrderItemInfo(
		cartItem: CartItem,
		priceInformation: PriceInformation
	) {
		const cartItemAction = cartItem.getAction();
		const action = cartItemAction.action;

		if (action === "partly-payment") {
			return {
				from: new Date(),
				to: cartItemAction.deadline,
				periodType: cartItemAction.period,
				amountLeftToPay: priceInformation.amountLeftToPay,
				customerItem: cartItem.getCustomerItemId(),
			};
		} else if (action === "rent") {
			return {
				from: new Date(),
				to: cartItemAction.deadline,
				numberOfPeriods: 1,
				periodType: cartItemAction.period,
				customerItem: cartItem.getCustomerItemId(),
			};
		} else if (action === "extend") {
			return {
				from: new Date(),
				to: cartItemAction.deadline,
				numberOfPeriods: 1,
				periodType: cartItemAction.period,
				customerItem: cartItem.getCustomerItemId(),
			};
		} else if (action === "buyback") {
			return {
				buybackAmount: priceInformation.amount,
				customerItem: cartItem.getCustomerItemId(),
			};
		} else {
			return null;
		}
	}
}
