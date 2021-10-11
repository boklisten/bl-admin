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
		const paymentIds = order.payments as string[];
		const payments = await Promise.all(
			paymentIds.map((paymentId) =>
				this._paymentService.getById(paymentId)
			)
		);
		return payments.some((payment) => this.isPaymentConfirmed(payment));
	}

	private isPaymentConfirmed(payment: Payment): boolean {
		return payment.confirmed;
	}
}
