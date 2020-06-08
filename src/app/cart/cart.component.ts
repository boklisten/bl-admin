import { Component, OnInit } from "@angular/core";
import { UserDetail } from "@wizardcoder/bl-model";
import { CartService } from "./cart.service";
import { CustomerService } from "../customer/customer.service";

@Component({
	selector: "app-cart",
	templateUrl: "./cart.component.html",
	styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
	public haveCustomer: boolean;
	public cartConfirmText: string;
	public cartFailureText: string;
	public customerDetail: UserDetail;

	constructor(
		private _cartService: CartService,
		private _customerService: CustomerService
	) {
		this.haveCustomer = false;
	}

	ngOnInit() {
		this.onCustomerChange();
	}

	private onCustomerChange() {
		this._customerService.subscribe((userDetail: UserDetail) => {
			this.customerDetail = userDetail;
			this.haveCustomer = this.customerDetail ? true : false;
		});
	}

	public onCartConfirmed() {
		this._cartService.confirmCart();
		this.cartConfirmText = "The order was confirmed";

		setTimeout(() => {
			this.cartConfirmText = null;
		}, 2000);
	}

	public onCartFailed() {}
}
