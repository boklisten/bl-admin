import {Component, Input, OnInit} from '@angular/core';
import {BlApiError, Order, Payment} from '@wizardcoder/bl-model';
import {PaymentService} from '@wizardcoder/bl-connect';

@Component({
	selector: 'app-order-payment-detail',
	templateUrl: './order-payment-detail.component.html',
	styleUrls: ['./order-payment-detail.component.scss']
})
export class OrderPaymentDetailComponent implements OnInit {
	@Input() order: Order;
	public wait: boolean;
	public warningText: string;
	public noPaymentsFoundText: string;

	public payments: Payment[];

	constructor(private _paymentService: PaymentService) {
		this.payments = [];
	}

	ngOnInit() {
		this.wait = true;
		this.noPaymentsFoundText = null;
		this.warningText = null;

		this._paymentService.getManyByIds(this.order.payments).then((payments: Payment[]) => {
			this.payments = payments;
			this.wait = false;

			if (this.payments.length <= 0) {
				this.noPaymentsFoundText = 'No payments found';
			}

		}).catch((blApiError: BlApiError) => {
			console.log('orderPaymentDetailComponent: could not get payments');
			this.warningText = 'could not find payments';
			this.wait = false;
		});
	}

	public calculateTotalAmount(): number {
		let totalAmount = 0;

		for (const payment of this.payments) {
			totalAmount += payment.amount;
		}

		return totalAmount;
	}

}
