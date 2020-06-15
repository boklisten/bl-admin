import { OrderItem } from "@wizardcoder/bl-model";
import { CartItem } from "../cart-item";

export class CartItemOrderItemProvider {
	public async createOrderItem(cartItem: CartItem): Promise<OrderItem> {
		const priceInformation = await cartItem.getPriceInformation();

		return {
			type: cartItem.getAction().action as any,
			item: cartItem.getItemId(),
			title: cartItem.getTitle(),
			age: "new",
			amount: priceInformation.amount,
			unitPrice: priceInformation.unitPrice,
			taxRate: priceInformation.taxRate,
			taxAmount: priceInformation.taxAmount,
			handout: false,
			info: null,
			discount: null,
			delivered: null,
			customerItem: null,
			match: null,
			movedToOrder: null,
			movedFromOrder: null
		};
	}
}
