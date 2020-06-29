import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { CartOrderService } from "../cart/cart-order/cart-order.service";
import { CheckoutService } from "./checkout.service";

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
				this.step = this.doneStep();
				setTimeout(() => {
					this.onDismiss();
				}, 1500);
			})
			.catch(e => {
				this.onCheckoutError(e);
			});
	}

	public onCustomerDetailValid(valid: boolean) {
		this.step.valid = valid;
	}

	public onPaymentConfirmed() {
		this.step.valid = true;
	}

	public onCheckoutError(e: any) {
		this.step.name = "error";
		this.step.valid = false;
		this.step.showConfirmButton = false;
		this.step.showHeader = true;
		this.checkoutError = e;
	}

	public onPaymentFailure() {
		console.log("payment failure");
		this.step.valid = false;
	}

	private calculateSteps(order: Order): Step[] {
		let steps = [
			{
				name: "summary",
				valid: true,
				showConfirmButton: true,
				showHeader: true
			}
		];

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

	private doneStep(): Step {
		return {
			name: "done",
			valid: false,
			showConfirmButton: false,
			showHeader: true
		};
	}
}
