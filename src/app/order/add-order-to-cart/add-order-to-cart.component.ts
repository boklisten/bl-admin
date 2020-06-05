import { Component, Input, OnInit } from "@angular/core";
import { Order, UserDetail } from "@wizardcoder/bl-model";
import { CartService } from "../../cart/cart.service";
import { Router } from "@angular/router";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";

@Component({
	selector: "app-add-order-to-cart",
	templateUrl: "./add-order-to-cart.component.html",
	styleUrls: ["./add-order-to-cart.component.scss"]
})
export class AddOrderToCartComponent implements OnInit {
	@Input() order: Order;

	constructor(
		private _cartService: CartService,
		private _router: Router,
		private userDetailService: UserDetailService,
		private _customerDetailService: CustomerDetailService
	) {}

	ngOnInit() {}

	public onAddToCart() {
		throw new Error("addToOrderToCartComponent: not implemented");
		/*
		this._customerDetailService
			.getAndSetCustomerDetailById(this.order.customer as string)
			.then((customerDetail: UserDetail) => {
				for (const orderItem of this.order.orderItems) {
					if (!orderItem.movedToOrder) {
						this._cartService.addOrderItem(orderItem, this.order);
					}
				}

				this._router.navigate(["/cart"]);
			})
			.catch(() => {
				console.log(
					"addOrderToCartComponent: could not get customer detail"
				);
			});
      */
	}
}
