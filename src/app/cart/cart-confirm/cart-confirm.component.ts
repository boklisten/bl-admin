import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CartService } from "../cart.service";
import { CustomerService } from "../../customer/customer.service";
import { CartConfirmService } from "./cart-confirm.service";
import { Delivery, Order } from "@wizardcoder/bl-model";

@Component({
	selector: "app-cart-confirm",
	templateUrl: "./cart-confirm.component.html",
	styleUrls: ["./cart-confirm.component.scss"]
})
export class CartConfirmComponent implements OnInit {
	@Output() confirmed: EventEmitter<boolean>;
	@Output() failure: EventEmitter<boolean>;

	public totalAmount: number;
	public showCustomer: boolean;
	public showGoToPaymentButton: boolean;
	public showConfirmOrderButton: boolean;
	public showDeliveryButton: boolean;
	public buttonDisabled: boolean;
	public showSummary: boolean;
	public showPayment: boolean;
	public order: Order;
	public wait: boolean;
	public errorText: string;
	public showConfirmation: boolean;
	public confirmationWait: boolean;
	public confirmationSuccess: boolean;
	public showDelivery: boolean;
	public orderShouldHaveDelivery: boolean;
	public originalDelivery: Delivery;

	constructor(
		private _cartService: CartService,
		private _customerService: CustomerService,
		private _cartConfirmService: CartConfirmService
	) {
		this.confirmed = new EventEmitter<boolean>();
		this.failure = new EventEmitter<boolean>();
	}

	ngOnInit() {
		this.wait = false;
		this.showGoToPaymentButton = false;
		this.buttonDisabled = false;
		this.showSummary = true;
		this.showConfirmation = false;
		this.showDelivery = false;

		this.totalAmount = this._cartService.getTotalAmount();
		this.showCustomer = this._customerService.haveCustomer();
		this.checkIfOrderShouldHaveDelivery();

		if (this.totalAmount !== 0) {
			this.showGoToPaymentButton = true;
		} else {
			this._cartConfirmService
				.orderShouldHaveDelivery()
				.then(shouldHaveDelivery => {
					if (shouldHaveDelivery) {
						this.showDeliveryButton = true;
					} else {
						this.showConfirmOrderButton = true;
					}
				});
		}
	}

	onGoToPayment() {
		this.wait = true;
		this.errorText = null;

		this.addOrder()
			.then((addedOrder: Order) => {
				this.showPayment = true;
				this.order = addedOrder;
				this.buttonDisabled = true;
				this.showSummary = false;
				this.wait = false;
			})
			.catch(addOrderError => {
				console.log(
					"cartConfirmComponent: could not add order",
					addOrderError
				);
				this.wait = false;
				this.errorText = "There was an error creating order";
			});
	}

	async onGoToDelivery() {
		this.originalDelivery = await this._cartConfirmService.getOriginalDelivery();

		this.addOrder()
			.then((order: Order) => {
				this.showDelivery = true;
				this.showSummary = false;
				this.showPayment = false;
				this.order = order;
			})
			.catch(err => {
				console.log(
					"cartConfirmComponent: could not add the order when going to delivery",
					err
				);
			});
	}

	onDeliveryConfirmed() {
		this.onConfirm();
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

		this._cartConfirmService
			.placeOrder(this.order)
			.then(() => {
				this._cartConfirmService
					.addOrUpdateCustomerItems(this.order)
					.then(() => {
						this.confirmed.emit(true);
					})
					.catch(addOrUpdateCustomerItemError => {
						console.log(
							"cartConfirmComponent: could not add or update customerItems",
							addOrUpdateCustomerItemError
						);
					});
			})
			.catch(placeOrderError => {
				console.log(
					"cartConfirmComponent: could not place order",
					placeOrderError
				);
			});
	}

	async onConfirm() {
		this.showConfirmation = true;
		this.showPayment = false;
		this.showSummary = false;
		this.confirmationWait = true;

		this.showGoToPaymentButton = false;
		this.showConfirmOrderButton = false;

		if (!this.order) {
			this.order = await this.addOrder();
		}

		this._cartConfirmService
			.placeOrder(this.order)
			.then(() => {
				this._cartConfirmService
					.addOrUpdateCustomerItems(this.order)
					.then(() => {
						this.confirmed.emit(true);
					})
					.catch(addOrUpdateCustomerItemError => {
						console.log(
							"cartConfirmComponent: could not add or update customerItems: " +
								addOrUpdateCustomerItemError
						);
					});
			})
			.catch(placeOrderError => {
				console.log(
					"cartConfirmComponent: could not place order: " +
						placeOrderError
				);
			});
	}

	onPaymentConfirmed() {
		this.buttonDisabled = false;
	}

	onPaymentFailure() {
		this.buttonDisabled = true;
	}

	private async checkIfOrderShouldHaveDelivery() {
		this.orderShouldHaveDelivery = await this._cartConfirmService.orderShouldHaveDelivery();
	}

	private async addOrder(): Promise<Order> {
		return await this._cartConfirmService
			.addOrder()
			.then((addedOrder: Order) => {
				return addedOrder;
			})
			.catch(addOrderError => {
				console.log(
					"cartConfirmComponent: could not add order",
					addOrderError
				);
				this.wait = false;
				this.errorText = "There was an error creating order";
				throw new Error("cartConfirmComponent: could not add order");
			});
	}
}
