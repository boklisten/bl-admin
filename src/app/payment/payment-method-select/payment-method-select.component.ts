import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { PaymentChoice } from "../payment-choice";
import { Order } from "@boklisten/bl-model";
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
	public paymentMethodForm: FormGroup;
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
	}

	async ngOnInit() {
		this.dibsAvailable = await this.checkDibsRepaymentAvailable();
		this.paymentMethodForm = this._formBuilder.group({
			card: false,
			cash: false,
			vipps: false,
			dibs: false,
		});

		this.paymentMethodForm.controls["card"].valueChanges.subscribe(
			(selected) => {
				this.card = selected;
				this.handleInputs();
			}
		);

		this.paymentMethodForm.controls["cash"].valueChanges.subscribe(
			(selected) => {
				this.cash = selected;
				this.handleInputs();
			}
		);

		this.paymentMethodForm.controls["vipps"].valueChanges.subscribe(
			(selected) => {
				this.vipps = selected;
				this.handleInputs();
			}
		);

		this.paymentMethodForm.controls["dibs"].valueChanges.subscribe(
			(selected) => {
				this.dibs = selected;
				this.handleInputs();
			}
		);
	}

	private async checkDibsRepaymentAvailable() {
		const originalOrderIds = [
			...new Set(
				this.order.orderItems
					.map((orderItem) => orderItem.movedFromOrder as string)
					.filter((orderId) => orderId.length > 0)
			),
		];

		const originalOrders = await Promise.all(
			originalOrderIds.map((orderId) =>
				this._orderService.getById(orderId)
			)
		);

		return originalOrders.every((order) => order.byCustomer);
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
