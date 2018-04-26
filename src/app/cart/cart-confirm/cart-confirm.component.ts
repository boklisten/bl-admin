import {Component, OnInit} from '@angular/core';
import {CartService} from '../cart.service';
import {CustomerService} from '../../customer/customer.service';

@Component({
	selector: 'app-cart-confirm',
	templateUrl: './cart-confirm.component.html',
	styleUrls: ['./cart-confirm.component.scss']
})
export class CartConfirmComponent implements OnInit {
	public totalAmount: number;
	public showCustomer: boolean;
	public showGoToPaymentButton: boolean;
	public showConfirmOrderButton: boolean;
	public buttonDisabled: boolean;

	constructor(private _cartService: CartService, private _customerService: CustomerService) {

	}

	ngOnInit() {
		this.showGoToPaymentButton = false;
		this.buttonDisabled = false;

		this.totalAmount = this._cartService.getTotalAmount();
		this.showCustomer = this._customerService.haveCustomer();

		if (this.totalAmount !== 0) {
			this.showGoToPaymentButton = true;
		} else {
			this.showConfirmOrderButton = true;
		}
	}

	onCustomerValid(valid: boolean) {
		if (valid) {
			this.buttonDisabled = false;
		} else {
			this.buttonDisabled = true;
		}
	}

}
