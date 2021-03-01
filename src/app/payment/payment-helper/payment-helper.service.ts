import { Injectable } from "@angular/core";
import { Order, Payment } from "@boklisten/bl-model";
import { PaymentService } from "@boklisten/bl-connect";

@Injectable({
	providedIn: "root",
})
export class PaymentHelperService {
	constructor(private _paymentService: PaymentService) {}

	public async isOrderPayedFor(order: Order): Promise<boolean> {
		if (!order.payments || order.payments.length <= 0) {
			return true;
		}

		for (let paymentId of order.payments) {
			let payment;
			try {
				payment = await this._paymentService.getById(
					paymentId as string
				);
			} catch (e) {}

			if (this.isPaymentConfirmed(payment)) {
				return true;
			}
		}

		return false;
	}

	private isPaymentConfirmed(payment: Payment): boolean {
		if (payment.confirmed) {
			return true;
		}
		return false;
	}
}
