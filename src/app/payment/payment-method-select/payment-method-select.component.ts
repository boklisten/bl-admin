import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { PaymentChoice } from "../payment-choice";
import { Order, PaymentMethod } from "@boklisten/bl-model";
import { OrderService } from "@boklisten/bl-connect";

@Component({
	selector: "app-payment-method-select",
	templateUrl: "./payment-method-select.component.html",
	styleUrls: ["./payment-method-select.component.scss"],
})
export class PaymentMethodSelectComponent implements OnInit {
	@Output() paymentChoices: EventEmitter<PaymentChoice[]>;
	@Output() failure: EventEmitter<boolean>;
	@Input() order: Order;
	public vipps: boolean;
	public vippsAmount: number;
	public card: boolean;
	public cardAmount: number;
	public cash: boolean;
	public cashAmount: number;
	public dibs: boolean;
	public dibsAmount: number;
	public showInput: boolean;
	public dibsAvailable: boolean;

	constructor(
		private _formBuilder: FormBuilder,
		private _orderService: OrderService
	) {
		this.paymentChoices = new EventEmitter<PaymentChoice[]>();
		this.failure = new EventEmitter<boolean>();

		this.vippsAmount = 0;
		this.cashAmount = 0;
		this.cardAmount = 0;
		this.dibsAmount = 0;

		this.cash = false;
		this.card = false;
		this.vipps = false;
		this.dibs = false;
	}

	async ngOnInit() {
		this.dibsAvailable = await this.checkDibsRepaymentAvailable();
	}

	public toggleSelectedPaymentMethod(paymentMethod: PaymentMethod) {
		switch (paymentMethod) {
			case "cash":
				this.cash = !this.cash;
				break;
			case "card":
				this.card = !this.card;
				break;
			case "vipps":
				this.vipps = !this.vipps;
				break;
			case "dibs":
				this.dibs = !this.dibs;
				break;
			default:
				throw new Error("Illegal payment method");
		}
		this.handleInputs();
	}

	private async checkDibsRepaymentAvailable() {
		const originalOrderIds = [
			...new Set(
				this.order.orderItems
					.filter(
						(orderItem) =>
							orderItem.movedFromOrder !== null &&
							typeof orderItem.movedFromOrder === "string"
					)
					.map((orderItem) => orderItem.movedFromOrder as string)
					.filter((orderItem) => orderItem.length > 0)
			),
		];

		const originalOrders = await Promise.all(
			originalOrderIds.map((orderId) =>
				this._orderService.getById(orderId)
			)
		);

		return (
			originalOrders.length > 0 &&
			originalOrders.every((order) => order.byCustomer)
		);
	}

	public onInputChange() {
		const totalAmount =
			parseInt(this.cardAmount.toString(), 10) +
			parseInt(this.cashAmount.toString(), 10) +
			parseInt(this.vippsAmount.toString(), 10) +
			parseInt(this.dibsAmount.toString(), 10);

		if (totalAmount === this.order.amount) {
			this.emitChoices();
		} else {
			this.failure.emit(true);
		}
	}

	private emitChoices() {
		const paymentChoices: PaymentChoice[] = [];

		if (this.card) {
			paymentChoices.push({ type: "card", amount: this.cardAmount });
		}

		if (this.cash) {
			paymentChoices.push({ type: "cash", amount: this.cashAmount });
		}

		if (this.vipps) {
			paymentChoices.push({ type: "vipps", amount: this.vippsAmount });
		}

		if (this.dibs) {
			paymentChoices.push({ type: "dibs", amount: this.dibsAmount });
		}

		this.paymentChoices.emit(paymentChoices);
	}

	private handleInputs() {
		this.showInput = false;

		if (!this.card && !this.cash && !this.vipps) {
			this.cardAmount = 0;
			this.cashAmount = 0;
			this.vippsAmount = 0;
			this.dibsAmount = 0;
			this.failure.emit(true);
		}

		if (this.cash && !this.card && !this.vipps && !this.dibs) {
			this.cashAmount = this.order.amount;
			this.emitChoices();
		} else if (this.card && !this.cash && !this.vipps && !this.dibs) {
			this.cardAmount = this.order.amount;
			this.emitChoices();
		} else if (this.vipps && !this.cash && !this.card && !this.dibs) {
			this.vippsAmount = this.order.amount;
			this.emitChoices();
		} else if (this.dibs && !this.vipps && !this.cash && !this.card) {
			this.dibsAmount = this.order.amount;
			this.emitChoices();
		} else {
			this.cardAmount = 0;
			this.vippsAmount = 0;
			this.cashAmount = 0;
			this.dibsAmount = 0;
			this.showInput = true;
			this.failure.emit(true);
		}
	}
}
