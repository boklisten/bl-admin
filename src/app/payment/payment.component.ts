import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Order} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
	@Input() order: Order;

	@Output() paymentComplete: EventEmitter<boolean>;
	@Output() paymentFailure: EventEmitter<boolean>;

	constructor() {
		this.paymentComplete = new EventEmitter<boolean>();
		this.paymentFailure = new EventEmitter<boolean>();
	}

	ngOnInit() {
		if (!this.order) {
			this.paymentFailure.emit(true);
			return;
		}

		console.log('should create payment for ', this.order);
	}

}
