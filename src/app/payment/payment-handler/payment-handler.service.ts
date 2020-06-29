import { Injectable } from "@angular/core";
import { PaymentChoice } from "../payment-choice";
import {
	Order,
	Payment,
	PaymentMethod,
	UserDetail
} from "@wizardcoder/bl-model";
import { PaymentService } from "@wizardcoder/bl-connect";
import { BranchStoreService } from "../../branch/branch-store.service";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";

@Injectable()
export class PaymentHandlerService {
	private _paymentChoices: PaymentChoice[];

	constructor(
		private _paymentService: PaymentService,
		private _branchStoreService: BranchStoreService,
		private _customerDetailService: CustomerDetailService
	) {}

	public setPaymentChoices(paymentChoices: PaymentChoice[]) {
		this._paymentChoices = paymentChoices;
	}

	public async addPayments(order: Order): Promise<boolean> {
		const payments = this.createPayments(order.id);

		for (const payment of payments) {
			await this._paymentService.add(payment);
		}

		return true;
	}

	private createPayments(orderId: string): Payment[] {
		const branch = this._branchStoreService.getCurrentBranch();
		const payments: Payment[] = [];
		let customerDetail;

		try {
			customerDetail = this._customerDetailService.get();
		} catch (e) {
			customerDetail = null;
		}

		for (const paymentChoice of this._paymentChoices) {
			payments.push(
				this.createPayment(
					orderId,
					paymentChoice.type,
					paymentChoice.amount,
					branch.id,
					customerDetail
				)
			);
		}

		return payments;
	}

	private createPayment(
		orderId: string,
		method: PaymentMethod,
		amount: number,
		branchId: string,
		customerDetail: UserDetail
	): Payment {
		return {
			method: method,
			order: orderId,
			amount: amount,
			branch: branchId,
			customer: customerDetail ? customerDetail.id : null,
			viewableFor: [customerDetail ? customerDetail.blid : null],
			taxAmount: 0
		} as Payment;
	}
}
