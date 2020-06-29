import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CartService } from "../cart.service";
import { CustomerService } from "../../customer/customer.service";
import { CartConfirmService } from "./cart-confirm.service";
import { Delivery, Order } from "@wizardcoder/bl-model";
import { CartOrderService } from "../cart-order/cart-order.service";

@Component({
	selector: "app-cart-confirm",
	templateUrl: "./cart-confirm.component.html",
	styleUrls: ["./cart-confirm.component.scss"]
})
export class CartConfirmComponent implements OnInit {
	@Output() confirmed: EventEmitter<boolean>;
	@Output() failure: EventEmitter<boolean>;

	public orderShouldHaveDelivery: boolean;
	public originalDelivery: Delivery;

	constructor(private _cartConfirmService: CartConfirmService) {
		this.confirmed = new EventEmitter<boolean>();
		this.failure = new EventEmitter<boolean>();
	}

	ngOnInit() {}

	async onGoToDelivery() {
		this.originalDelivery = await this._cartConfirmService.getOriginalDelivery();
	}

	private async checkIfOrderShouldHaveDelivery() {
		this.orderShouldHaveDelivery = await this._cartConfirmService.orderShouldHaveDelivery();
	}
}
