import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	Output,
	EventEmitter,
} from "@angular/core";
import { BlApiError, Order, Payment } from "@boklisten/bl-model";
import { PaymentService, OrderService } from "@boklisten/bl-connect";
import { AuthService } from "../../../auth/auth.service";

@Component({
	selector: "app-order-payment-detail",
	templateUrl: "./order-payment-detail.component.html",
	styleUrls: ["./order-payment-detail.component.scss"],
})
export class OrderPaymentDetailComponent implements OnInit, OnChanges {
	@Input() order: Order;
	@Output() paymentChange: EventEmitter<boolean>;
	public wait: boolean;
	public warningText: string;
	public noPaymentsFoundText: string;
	public payments: Payment[];
	public isAdmin: boolean;

	constructor(
		private _paymentService: PaymentService,
		private _orderService: OrderService,
		private _authService: AuthService
	) {
		this.payments = [];
		this.paymentChange = new EventEmitter();
	}

	ngOnInit() {
		this.isAdmin = this._authService.isAdmin();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes["order"].currentValue !== changes["order"].previousValue) {
			this.getPayment();
		}
	}

	private getPayment() {
		this.wait = true;
		this.noPaymentsFoundText = null;
		this.warningText = null;

		this._paymentService
			.getManyByIds(this.order.payments as string[])
			.then((payments: Payment[]) => {
				this.payments = payments;
				this.wait = false;

				if (this.payments.length <= 0) {
					this.noPaymentsFoundText = "No payments found";
				}
			})
			.catch((blApiError: BlApiError) => {
				this.warningText = "could not find payments";
				this.wait = false;
			});
	}

	public confirmPayment(payment: Payment) {
		this._paymentService
			.update(payment.id, { confirmed: true })
			.then(() => {
				this.paymentChange.emit(true);
			})
			.catch(() => {});
	}

	public deletePayment(payment: Payment) {
		this._paymentService
			.remove(payment.id)
			.then((removed) => {
				this.removePaymentFromOrder(payment.id)
					.then(() => {
						this.paymentChange.emit(true);
					})
					.catch((e) => {
						console.log("could not remove payment from order", e);
					});
			})
			.catch((err) => {
				console.log("could not remove payment");
			});
	}

	private async removePaymentFromOrder(paymentId: string): Promise<Order> {
		let payments = this.order.payments as string[];

		payments = payments.filter((pid) => {
			return pid != paymentId;
		});

		try {
			return await this._orderService.update(this.order.id, {
				payments: payments,
			});
		} catch (e) {
			throw e;
		}
	}

	public calculateTotalAmount(): number {
		let totalAmount = 0;

		for (const payment of this.payments) {
			totalAmount += payment.amount;
		}

		return totalAmount;
	}
}
