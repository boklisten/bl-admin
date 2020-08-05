import { Component, OnInit, OnDestroy } from "@angular/core";
import { Order } from "@wizardcoder/bl-model";
import { CustomerService } from "../customer/customer.service";
import { CartService } from "../cart/cart.service";
import { Subscription } from "rxjs";
import { CheckoutService } from "../checkout/checkout.service";
import { CartItemService } from "../cart/cart-item/cart-item.service";
import { OrderManagerListService } from "./order-manager-list/order-manager-list.service";

@Component({
	selector: "app-order-manager",
	templateUrl: "./order-manager.component.html",
	styleUrls: ["./order-manager.component.scss"]
})
export class OrderManagerComponent implements OnInit, OnDestroy {
	public activeOrder: Order;
	private checkoutChange$: Subscription;

	constructor(
		private _customerService: CustomerService,
		private _cartService: CartService,
		private _checkoutService: CheckoutService,
		private _cartItemService: CartItemService,
		private _orderManagerListService: OrderManagerListService
	) {}

	ngOnInit() {
		this.handleCheckoutChange();
	}

	ngOnDestroy() {
		this.checkoutChange$.unsubscribe();
	}

	public onOrderDeleted() {
		this._orderManagerListService.reload();
		this._customerService.clear();
		this.activeOrder = null;
	}

	public onSelectOrder(order: Order) {
		this._customerService
			.setById(order.customer as string)
			.then(() => {
				this._cartService.clear();
				this.activeOrder = order;
			})
			.catch(err => {
				this.activeOrder = null;
				console.log("Error in orderManagerComponent", err);
			});
	}

	private handleCheckoutChange() {
		this.checkoutChange$ = this._checkoutService.subscribe(() => {
			this._customerService.clear();
			this.activeOrder = null;
		});
	}
}
