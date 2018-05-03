import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PaymentChoice} from '../payment-choice';

@Component({
	selector: 'app-payment-method-select',
	templateUrl: './payment-method-select.component.html',
	styleUrls: ['./payment-method-select.component.scss']
})
export class PaymentMethodSelectComponent implements OnInit {
	@Output() paymentChoices: EventEmitter<PaymentChoice[]>;
	@Output() failure: EventEmitter<boolean>;
	@Input() amount: number;
	public paymentMethodForm: FormGroup;
	public vipps: boolean;
	public vippsAmount: number;
	public card: boolean;
	public cardAmount: number;
	public cash: boolean;
	public cashAmount: number;
	public showInput: boolean;

	constructor(private _formBuilder: FormBuilder) {
		this.paymentChoices = new EventEmitter<PaymentChoice[]>();
		this.failure = new EventEmitter<boolean>();

		this.vippsAmount = 0;
		this.cashAmount = 0;
		this.cardAmount = 0;
	}

	ngOnInit() {
		this.paymentMethodForm = this._formBuilder.group({
			card: false,
			cash: false,
			vipps: new FormControl({value: false, disabled: true})
		});

		this.paymentMethodForm.controls['card'].valueChanges.subscribe((selected) => {
			this.card = selected;
			this.handleInputs();
		});

		this.paymentMethodForm.controls['cash'].valueChanges.subscribe((selected) => {
			this.cash = selected;
			this.handleInputs();
		});


		this.paymentMethodForm.controls['vipps'].valueChanges.subscribe((selected) => {
			this.vipps = selected;
			this.handleInputs();
		});
	}

	public onInputChange() {
		const totalAmount = parseInt(this.cardAmount.toString(), 10)
			+ parseInt(this.cashAmount.toString(), 10)
			+ parseInt(this.vippsAmount.toString(), 10);

		if (totalAmount === this.amount) {
			this.emitChoices();
		} else {
			this.failure.emit(true);
		}
	}

	private emitChoices() {
		const paymentChoices: PaymentChoice[] = [];

		if (this.card) {
			paymentChoices.push({type: 'card', amount: this.cardAmount});
		}

		if (this.cash) {
			paymentChoices.push({type: 'cash', amount: this.cashAmount});
		}

		if (this.vipps) {
			paymentChoices.push({type: 'vipps', amount: this.vippsAmount});
		}

		this.paymentChoices.emit(paymentChoices);
	}

	private handleInputs() {
		this.showInput = false;

		if (!this.card && !this.cash && !this.vipps) {
			this.cardAmount = 0;
			this.cashAmount = 0;
			this.vippsAmount = 0;
			this.failure.emit(true);
		}

		if (this.cash && !this.card && !this.vipps) {
			this.cashAmount = this.amount;
			this.emitChoices();
		} else if (this.card && !this.cash && !this.vipps) {
			this.cardAmount = this.amount;
			this.emitChoices();
		} else if (this.vipps && !this.cash && !this.card) {
			this.vippsAmount = this.amount;
			this.emitChoices();
		} else {
			this.cardAmount = 0;
			this.vippsAmount = 0;
			this.cashAmount = 0;
			this.showInput = true;
			this.failure.emit(true);
		}
	}


}
