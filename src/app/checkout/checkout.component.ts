import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Order, Delivery } from "@wizardcoder/bl-model";
import { CartOrderService } from "../cart/cart-order/cart-order.service";
import { CheckoutService } from "./checkout.service";
import { CartDeliveryService } from "../cart/cart-delivery/cart-delivery.service";

type Step = {
	name: string;
	valid: boolean;
	showConfirmButton: boolean;
	showHeader: boolean;
};

@Component({
	selector: "app-checkout",
	templateUrl: "./checkout.component.html",
	styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
	@Output() dismiss: EventEmitter<boolean>;
	public wait: boolean;
	public order: Order;
	public step: Step;
	private steps: Step[];
	private stepIndex: number;
	public checkoutError: any;
	public delivery: Delivery;

	constructor(
		private _cartOrderService: CartOrderService,
		private _checkoutService: CheckoutService,
		private _cartDeliveryService: CartDeliveryService
	) {
		this.dismiss = new EventEmitter();
	}

	ngOnInit() {
		this.wait = true;
		this.step = this.loadingOrderStep();
		this.init();
	}

	private async init() {
		try {
			const order = await this._cartOrderService.createOrder();
			this.order = order;
			this.steps = await this.calculateSteps(this.order);
			this.stepIndex = 0;
			this.step = this.steps[this.stepIndex];
			this.wait = false;
		} catch (e) {
			this.wait = false;
			this.checkoutError = e;
			this.step = this.errorStep();
		}
	}

	public onDismiss() {
		this.dismiss.emit(true);
	}

	public onNext() {
		if (
			this.step.name == "payment" ||
			(this.order.amount == 0 && this.step.name == "summary")
		) {
			this.onConfirmCheckout();
		}
		this.stepIndex++;
		this.step = this.steps[this.stepIndex];
	}

	public onConfirmCheckout() {
		this._checkoutService
			.checkout(this.order)
			.then(order => {
				this.step = this.doneStep();
				setTimeout(() => {
					this.onDismiss();
				}, 1500);
			})
			.catch(e => {
				this.onCheckoutError(e);
			});
	}

	public onGoToDelivery() {}

	public onCustomerDetailValid(valid: boolean) {
		this.step.valid = valid;
	}

	public onPaymentConfirmed() {
		this.step.valid = true;
	}

	public onCheckoutError(e: any) {
		this.checkoutError = e;
		this.step = this.errorStep();
	}

	public onPaymentFailure() {
		this.step.valid = false;
	}

	private async calculateSteps(order: Order): Promise<Step[]> {
		let steps = [
			{
				name: "summary",
				valid: true,
				showConfirmButton: true,
				showHeader: true
			}
		];

		try {
			const deliveryStep = await this.getDeliveryStepIfPresentInCart();
			console.log("should add delivery step");
			steps.push(deliveryStep);
		} catch (e) {}

		if (order.amount !== 0) {
			steps.push({
				name: "payment",
				valid: false,
				showConfirmButton: true,
				showHeader: true
			});
		}

		steps.push({
			name: "processing",
			valid: true,
			showConfirmButton: false,
			showHeader: false
		});

		return steps;
	}

	private async getDeliveryStepIfPresentInCart(): Promise<Step> {
		try {
			const delivery = await this._cartDeliveryService.getDeliveryIfPresent();
			return this.deliveryStep();
		} catch (e) {}
	}

	private deliveryStep(): Step {
		return {
			name: "delivery",
			valid: false,
			showConfirmButton: true,
			showHeader: true
		};
	}

	private errorStep(): Step {
		return {
			name: "error",
			valid: false,
			showConfirmButton: false,
			showHeader: true
		};
	}

	private doneStep(): Step {
		return {
			name: "done",
			valid: false,
			showConfirmButton: false,
			showHeader: true
		};
	}

	private loadingOrderStep(): Step {
		return {
			name: "loading",
			valid: false,
			showConfirmButton: false,
			showHeader: false
		};
	}
}
