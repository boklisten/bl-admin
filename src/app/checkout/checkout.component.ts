import { Component, OnInit, Input } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { CartOrderService } from "../cart/cart-order/cart-order.service";

type Step = { name: string; valid: boolean };

@Component({
	selector: "app-checkout",
	templateUrl: "./checkout.component.html",
	styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
	public wait: boolean;
	public order: Order;
	public step: Step;
	private steps: Step[];
	private stepIndex: number;

	constructor(private _cartOrderService: CartOrderService) {}

	ngOnInit() {
		this.wait = true;

		this.steps = [];

		this.stepIndex = 0;
		this.step = this.steps[this.stepIndex];

		this._cartOrderService
			.createOrder()
			.then(order => {
				this.order = order;
				this.wait = false;
			})
			.catch(e => {
				this.wait = false;
			});
	}

	public onNext() {
		this.stepIndex++;
		this.step = this.steps[this.stepIndex];
	}

	public onPaymentConfirmed() {
		console.log("payment confirmed");
		this.step.valid = true;
	}

	public onPaymentFailure() {
		console.log("payment failure");
		this.step.valid = false;
	}

	private calculateSteps(order: Order): Step[] {
		return [
			{ name: "summary", valid: true },
			{ name: "payment", valid: false },
			{ name: "done", valid: false }
		];
	}
}
