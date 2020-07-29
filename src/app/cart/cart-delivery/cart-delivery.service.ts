import { Injectable } from "@angular/core";
import { Delivery } from "@wizardcoder/bl-model";
import { DeliveryService } from "@wizardcoder/bl-connect";
import { CartService } from "../cart.service";

@Injectable({
	providedIn: "root"
})
export class CartDeliveryService {
	constructor(
		private _deliveryService: DeliveryService,
		private _cartService: CartService
	) {}

	public async getDeliveryIfPresent(): Promise<Delivery> {
		let deliveryIds: string[] = [];

		for (let cartItem of this._cartService.getCart()) {
			if (cartItem.getDeliveryId()) {
				deliveryIds.push(cartItem.getDeliveryId());
			}
		}

		const distinctDeliveries = deliveryIds.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});

		let deliveries = [];

		for (let distinctDelivery of distinctDeliveries) {
			try {
				const delivery = await this._deliveryService.getById(
					distinctDelivery
				);

				deliveries.push(delivery);
			} catch (e) {}
		}

		return deliveries[0] ? deliveries[0] : null;
	}
}
