import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
	@Output() confirmed: EventEmitter<boolean>;
	@Output() failure: EventEmitter<boolean>;

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
	public showConfirmation: boolean;
	public confirmationWait: boolean;
	public confirmationSuccess: boolean;

	constructor(private _cartService: CartService, private _customerService: CustomerService,
	            private _cartConfirmService: CartConfirmService) {
		this.confirmed = new EventEmitter<boolean>();
		this.failure = new EventEmitter<boolean>();
	}

	ngOnInit() {
		this.wait = false;
		this.showGoToPaymentButton = false;
		this.buttonDisabled = false;
		this.showSummary = true;
		this.showConfirmation = false;

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
			console.log('hi there');
			this.showPayment = true;
			this.order = addedOrder;
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
		this.showConfirmation = false;
		this.showPayment = false;
	}

	onCustomerValid(valid: boolean) {
		if (valid) {
			this.buttonDisabled = false;
		} else {
			this.buttonDisabled = true;
		}
	}

	onConfirmPayment() {
		this.wait = true;

		this._cartConfirmService.placeOrder(this.order).then(() => {
			this._cartConfirmService.addOrUpdateCustomerItems(this.order).then(() => {
				console.log('the order was confirmed and customerItems was processed');
				this.confirmed.emit(true);
			}).catch((addOrUpdateCustomerItemError) => {
				console.log('cartConfirmComponent: could not add or update customerItems', addOrUpdateCustomerItemError);
			});
		}).catch((placeOrderError) => {
			console.log('cartConfirmComponent: could not place order', placeOrderError);
		});
	}

	onConfirm() {
		this.showConfirmation = true;
		this.showPayment = false;
		this.showSummary = false;
		this.confirmationWait = true;

		this.showGoToPaymentButton = false;
		this.showConfirmOrderButton = false;
		/*
		this._cartConfirmService.confirm().then(() => {
			this.confirmationWait = false;
			this.confirmed.emit(true);
		}).catch((e) => {
			this.wait = false;
			console.log('we could not confirm cart', e);
			this.failure.emit(true);
		});
		*/
	}

	onPaymentConfirmed() {
		console.log('the payments was confirmed');
		this.buttonDisabled = false;
	}

	onPaymentFailure() {
		console.log('the payments failed');
		this.buttonDisabled = true;
	}

}
