import { Component, OnInit, Input } from "@angular/core";
import { CartItem } from "../../../cart-item/cart-item";
import { PriceInformation } from "../../../../price/price-information";

@Component({
	selector: "app-cart-list-item-amount",
	templateUrl: "./cart-list-item-amount.component.html",
	styleUrls: ["./cart-list-item-amount.component.scss"]
})
export class CartListItemAmountComponent implements OnInit {
	@Input() cartItem: CartItem;
	public priceInformation: PriceInformation;

	constructor() {}

	ngOnInit() {
		this.priceInformation = this.cartItem.getPriceInformation();
	}
}
