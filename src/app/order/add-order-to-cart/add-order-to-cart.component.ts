import { Component, Input, OnInit } from "@angular/core";
import { Order, UserDetail } from "@boklisten/bl-model";
import { CartService } from "../../cart/cart.service";
import { Router } from "@angular/router";
import { UserDetailService } from "@boklisten/bl-connect";
import { CustomerService } from "../../customer/customer.service";
import { CartItemService } from "../../cart/cart-item/cart-item.service";

@Component({
	selector: "app-add-order-to-cart",
	templateUrl: "./add-order-to-cart.component.html",
	styleUrls: ["./add-order-to-cart.component.scss"],
})
export class AddOrderToCartComponent implements OnInit {
	@Input() order: Order;

	constructor(
		private _cartService: CartService,
		private _router: Router,
		private _customerService: CustomerService,
		private _cartItemService: CartItemService
	) {}

	ngOnInit() {}

	public async onAddToCart() {
		await this._customerService.setById(this.order.customer as string);

		for (const orderItem of this.order.orderItems) {
			if (!orderItem.movedToOrder) {
				const cartItem = await this._cartItemService.createCartItemByOrderItem(
					orderItem,
					this.order
				);
				this._cartService.add(cartItem);
			}
		}
	}
}
