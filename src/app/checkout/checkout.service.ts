import { Injectable } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { OrderService } from "@wizardcoder/bl-connect";
import { PaymentHandlerService } from "../payment/payment-handler/payment-handler.service";
import { Subject, Subscription } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class CheckoutService {
	private checkout$: Subject<Order>;

	constructor(
		private _orderService: OrderService,
		private _paymentHandlerService: PaymentHandlerService
	) {
		this.checkout$ = new Subject();
	}

	public subscribe(func: (addedOrder: Order) => void): Subscription {
		return this.checkout$.subscribe(func);
	}

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

			this.checkout$.next(addedOrder);
			return addedOrder;
		} catch (e) {
			throw e;
		}
	}
}