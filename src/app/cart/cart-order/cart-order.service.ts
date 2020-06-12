import { Injectable } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { CartItem } from "../cart-item/cart-item";
import { CartService } from "../cart.service";
import { OrderGeneratorService } from "../../order/order-generator/order-generator.service";

@Injectable({
	providedIn: "root"
})
export class CartOrderService {
	private _cart: CartItem[];

	constructor(
		private _cartService: CartService,
		private _orderGeneratorService: OrderGeneratorService
	) {
		this.handleCartChange();
	}

	private handleCartChange() {
		this._cartService.subscribe(cart => {
			this._cart = cart;
		});
	}

	public async createOrder(): Promise<Order> {
		const orderItems = [];
		for (let cartItem of this._cart) {
			orderItems.push(cartItem.createOrderItem());
		}
		const order = this._orderGeneratorService.generateOrder(orderItems);
		console.log("order!", order);
		return null;
	}
}
