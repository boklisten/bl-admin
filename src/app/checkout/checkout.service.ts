import { Injectable } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { OrderService } from "@wizardcoder/bl-connect";
import { PaymentHandlerService } from "../payment/payment-handler/payment-handler.service";
import { CustomerService } from "../customer/customer.service";
import { CartService } from "../cart/cart.service";

@Injectable({
	providedIn: "root"
})
export class CheckoutService {
	constructor(
		private _orderService: OrderService,
		private _paymentHandlerService: PaymentHandlerService,
		private _customerService: CustomerService,
		private _cartService: CartService
	) {}

	public async checkout(order: Order): Promise<Order> {
		try {
			let addedOrder = await this._orderService.add(order);

			if (addedOrder.amount !== 0) {
				await this._paymentHandlerService.addPayments(addedOrder);
			}

			await this._orderService.updateWithOperation(
				addedOrder.id,
				{},
				"place"
			);

			addedOrder = await this._orderService.getById(addedOrder.id);

			this._customerService.reload();
			this._cartService.clear();
			console.log("we added a order in db", addedOrder);
			return addedOrder;
		} catch (e) {
			console.log("could not add order", e);
			throw e;
		}
		//throw "not implemented";
		// add order to db
		// if payment options, add payments to db and add payment to order
		// if delivery options, add delivery to db and add delivery to order
		// place order
		// update customerItems if they should be updated
		// return the updated order
		//
		// if errors occur, reject
	}
}
