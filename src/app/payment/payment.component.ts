import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Order } from "@boklisten/bl-model";
import { PaymentChoice } from "./payment-choice";
import { PaymentHandlerService } from "./payment-handler/payment-handler.service";

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
	@Input() order: Order;

	@Output() paymentComplete: EventEmitter<boolean>;
	@Output() paymentFailure: EventEmitter<boolean>;

	constructor(private _paymentHandlerService: PaymentHandlerService) {
		this.paymentComplete = new EventEmitter<boolean>();
		this.paymentFailure = new EventEmitter<boolean>();
	}

	ngOnInit() {
		if (!this.order) {
			this.paymentFailure.emit(true);
			return;
		}

		this.paymentFailure.emit(true);
	}

	onPaymentChoices(paymentChoices: PaymentChoice[]) {
		this._paymentHandlerService.setPaymentChoices(paymentChoices);
		this.paymentComplete.emit(true);
	}

	onPaymentChoiceFailure() {
		this.paymentFailure.emit(true);
	}
}
