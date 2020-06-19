import { Component, OnInit, Input } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";

@Component({
	selector: "app-order-payment-information",
	templateUrl: "./order-payment-information.component.html",
	styleUrls: ["./order-payment-information.component.scss"]
})
export class OrderPaymentInformationComponent implements OnInit {
	@Input() order: Order;

	constructor() {}

	ngOnInit() {}
}
