import { Injectable } from "@angular/core";
import { Order } from "@boklisten/bl-model";
import { CartService } from "../cart.service";
import { OrderGeneratorService } from "../../order/order-generator/order-generator.service";

@Injectable({
	providedIn: "root"
})
export class CartOrderService {
	constructor(
		private _cartService: CartService,
		private _orderGeneratorService: OrderGeneratorService
	) {}

	public async createOrder(): Promise<Order> {
		const orderItems = [];

		for (let cartItem of this._cartService.getCart()) {
			orderItems.push(await cartItem.createOrderItem());
		}
		return this._orderGeneratorService.generateOrder(orderItems);
	}
}
