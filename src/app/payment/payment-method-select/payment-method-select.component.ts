import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-payment-method-select',
	templateUrl: './payment-method-select.component.html',
	styleUrls: ['./payment-method-select.component.scss']
})
export class PaymentMethodSelectComponent implements OnInit {
	public paymentMethodForm: FormGroup;

	constructor(private _formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.paymentMethodForm = this._formBuilder.group({
			card: true,
			cash: false,
			vipps: false
		});

		this.paymentMethodForm.controls['card'].valueChanges.subscribe((value) => {
			console.log('card: ', value);
		});

		this.paymentMethodForm.controls['cash'].valueChanges.subscribe((value) => {
			console.log('cash: ', value);
		});


		this.paymentMethodForm.controls['vipps'].valueChanges.subscribe((value) => {
			console.log('vipps: ', value);
		});
	}
}
