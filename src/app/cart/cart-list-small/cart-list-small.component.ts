import { Component, OnInit } from "@angular/core";
import { CartItem } from "../cartItem";
import { CartService } from "../cart.service";

@Component({
	selector: "app-cart-list-small",
	templateUrl: "./cart-list-small.component.html",
	styleUrls: ["./cart-list-small.component.scss"]
})
export class CartListSmallComponent implements OnInit {
	public cart: CartItem[];
	public cartTotalAmount: number;

	constructor(private _cartService: CartService) {}

	ngOnInit() {
		this.cart = this._cartService.getCart();
		this.cartTotalAmount = this._cartService.getTotalAmount();
	}

	getTotalAmountWithPartlyPayments() {
		return this._cartService.getTotalAmountWithPartlyPayments();
	}

	cartIncludesPartlyPayments() {
		return this._cartService.cartIncludesPartlyPayments();
	}
}
