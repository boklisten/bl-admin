import {Component, OnInit} from '@angular/core';
import {CartService} from '../cart.service';
import {CustomerService} from '../../customer/customer.service';
import {CartConfirmService} from './cart-confirm.service';
import {Order} from '@wizardcoder/bl-model';

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
	public showSummary: boolean;
	public showPayment: boolean;
	public order: Order;
	public wait: boolean;
	public errorText: string;

	constructor(private _cartService: CartService, private _customerService: CustomerService,
	            private _cartConfirmService: CartConfirmService) {

	}

	ngOnInit() {
		this.wait = false;
		this.showGoToPaymentButton = false;
		this.buttonDisabled = false;
		this.showSummary = true;

		this.totalAmount = this._cartService.getTotalAmount();
		this.showCustomer = this._customerService.haveCustomer();

		if (this.totalAmount !== 0) {
			this.showGoToPaymentButton = true;
		} else {
			this.showConfirmOrderButton = true;
		}
	}

	onGoToPayment() {
		this.wait = true;
		this.errorText = null;
		this._cartConfirmService.addOrder().then((addedOrder: Order) => {
			this.order = addedOrder;
			this.showPayment = true;
			this.buttonDisabled = true;
			this.showSummary = false;
			this.wait = false;
		}).catch((addOrderError) => {
			console.log('cartConfirmComponent: could not add order', addOrderError);
			this.wait = false;
			this.errorText = 'There was an error creating order';
		});
	}

	onGoToSummary() {
		this.showSummary = true;
		this.showPayment = false;
	}

	onCustomerValid(valid: boolean) {
		if (valid) {
			this.buttonDisabled = false;
		} else {
			this.buttonDisabled = true;
		}
	}

	onConfirm() {
		this._cartConfirmService.confirm();
	}

	onPaymentConfirmed() {
		console.log('the payments was confirmed');
	}

	onPaymentFailure() {
		console.log('the payments failed');
	}

}
