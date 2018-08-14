import {Injectable} from '@angular/core';
import {PaymentChoice} from '../payment-choice';
import {Order, Payment, PaymentMethod, UserDetail} from '@wizardcoder/bl-model';
import {PaymentService} from '@wizardcoder/bl-connect';
import {BranchStoreService} from '../../branch/branch-store.service';
import {CustomerService} from '../../customer/customer.service';
import {Customer} from '../../customer/customer';

@Injectable()
export class PaymentHandlerService {
	private _paymentChoices: PaymentChoice[];

	constructor(private _paymentService: PaymentService, private _branchStoreService: BranchStoreService, private _customerService: CustomerService) {
	}

	public setPaymentChoices(paymentChoices: PaymentChoice[]) {
		this._paymentChoices = paymentChoices;
	}

	public async addPayments(order: Order): Promise<boolean> {
		const payments = this.createPayments(order.id);

		for (const payment of payments) {
			await this._paymentService.add(payment);
		}

		console.log('added the payments', payments);

		return true;
	}


	private createPayments(orderId: string): Payment[] {
		const branch = this._branchStoreService.getCurrentBranch();
		let customerDetail: UserDetail;
		const payments: Payment[] = [];

		if (this._customerService.haveCustomer()) {
			customerDetail = this._customerService.get().detail;
		}

		for (const paymentChoice of this._paymentChoices) {
			payments.push(this.createPayment(orderId, paymentChoice.type, paymentChoice.amount, branch.id, customerDetail));
		}

		return payments;
	}

	private createPayment(orderId: string, method: PaymentMethod, amount: number, branchId: string, customerDetail: UserDetail): Payment {
		return {
			method: method,
			order: orderId,
			amount: amount,
			branch: branchId,
			customer: customerDetail.id,
			viewableFor: [customerDetail.blid],
			taxAmount: 0
		} as Payment;
	}

}
