import { Component, Input, OnInit } from "@angular/core";
import { CartService } from "../../cart.service";
import { CartItem } from "../../cart-item/cart-item";

@Component({
	selector: "app-cart-list-item",
	templateUrl: "./cart-list-item.component.html",
	styleUrls: ["./cart-list-item.component.scss"]
})
export class CartListItemComponent implements OnInit {
	@Input() cartItem: CartItem;
	public title: string;

	constructor(private _cartService: CartService) {}

	ngOnInit() {
		this.title = this.cartItem.getTitle();
	}

	public onRemove() {
		this._cartService.remove(this.cartItem);
	}
}
