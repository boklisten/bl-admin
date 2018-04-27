import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-payment-method-select',
	templateUrl: './payment-method-select.component.html',
	styleUrls: ['./payment-method-select.component.scss']
})
export class PaymentMethodSelectComponent implements OnInit {
	public paymentMethodForm: FormGroup;
	public vipps: boolean;
	public card: boolean;
	public cash: boolean;
	public showInput: boolean;

	constructor(private _formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.paymentMethodForm = this._formBuilder.group({
			card: false,
			cash: false,
			vipps: new FormControl({value: false, disabled: true})
		});

		this.paymentMethodForm.controls['card'].valueChanges.subscribe((value) => {
			this.card = value;
			this.showInputs();
		});

		this.paymentMethodForm.controls['cash'].valueChanges.subscribe((value) => {
			this.cash = value;
			this.showInputs();
		});


		this.paymentMethodForm.controls['vipps'].valueChanges.subscribe((value) => {
			this.vipps = value;
			this.showInputs();
		});
	}

	private showInputs() {
		if ((this.card && (this.cash || this.vipps)) || (this.cash && (this.card || this.vipps)) || (this.vipps && (this.card || this.cash))) {
			this.showInput = true;
		} else {
			this.showInput = false;
		}
	}
}
