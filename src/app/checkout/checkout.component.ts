import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { CartOrderService } from "../cart/cart-order/cart-order.service";
import { CheckoutService } from "./checkout.service";

type Step = { name: string; valid: boolean; showButton: boolean };

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

	constructor(
		private _cartOrderService: CartOrderService,
		private _checkoutService: CheckoutService
	) {
		this.dismiss = new EventEmitter();
	}

	ngOnInit() {
		this.wait = true;

		this._cartOrderService
			.createOrder()
			.then(order => {
				this.order = order;
				this.steps = this.calculateSteps(this.order);
				this.stepIndex = 0;
				this.step = this.steps[this.stepIndex];
				this.wait = false;
			})
			.catch(e => {
				this.wait = false;
			});
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
				console.log("checkout finished!", order);
				this.onDismiss();
			})
			.catch(e => {
				this.onCheckoutError(e);
				console.log("checkout failed", e);
			});
	}

	public onPaymentConfirmed() {
		this.step.valid = true;
	}

	public onCheckoutError(e: any) {
		console.log("error!", e);
	}

	public onPaymentFailure() {
		console.log("payment failure");
		this.step.valid = false;
	}

	private calculateSteps(order: Order): Step[] {
		let steps = [{ name: "summary", valid: true, showButton: true }];

		if (order.amount !== 0) {
			steps.push({ name: "payment", valid: false, showButton: true });
		}

		steps.push({ name: "processing", valid: true, showButton: false });
		steps.push({ name: "done", valid: false, showButton: false });

		return steps;
	}
}
