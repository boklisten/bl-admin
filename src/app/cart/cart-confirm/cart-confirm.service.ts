import { Injectable } from "@angular/core";
import { OrderHandlerService } from "../../order/order-handler/order-handler.service";
import { Delivery, Order } from "@boklisten/bl-model";
import { CartService } from "../cart.service";
import { DeliveryService } from "@boklisten/bl-connect";

@Injectable()
export class CartConfirmService {
	constructor(
		private _cartService: CartService,
		private _deliveryService: DeliveryService
	) {}

	public async orderShouldHaveDelivery() {
		/*
		for (const cartItem of this._cartService.getCart()) {
			if (cartItem.originalOrder && cartItem.originalOrder.delivery) {
				const delivery = await this._deliveryService.getById(cartItem
					.originalOrder.delivery as string);
				if (delivery.method !== "bring") {
					return false;
				}
			} else {
				return false;
			}
		}
    */

		return false;
	}
	public async getOriginalDelivery(): Promise<Delivery> {
		for (const cartItem of this._cartService.getCart()) {
			if (cartItem.originalOrder && cartItem.originalOrder.delivery) {
				const delivery = await this._deliveryService.getById(
					cartItem.originalOrder.delivery as string
				);
				if (delivery.method === "bring") {
					return delivery;
				}
			}
		}

		throw new Error("could not find original delivery");
	}
}
