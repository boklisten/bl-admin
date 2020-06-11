import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { CartService } from "../../cart.service";
import { CartItem } from "../../cart-item/cart-item";
import { CartItemAction } from "../../cartItemAction";

@Component({
	selector: "app-cart-list-item",
	templateUrl: "./cart-list-item.component.html",
	styleUrls: ["./cart-list-item.component.scss"]
})
export class CartListItemComponent implements OnInit {
	@Input() cartItem: CartItem;
	@Output() cartItemChange: EventEmitter<boolean>;
	public cartItemAction: CartItemAction;
	public title: string;

	constructor(private _cartService: CartService) {
		this.cartItemChange = new EventEmitter<boolean>();
	}

	ngOnInit() {
		this.title = this.cartItem.getTitle();
	}

	public onActionChange(action: CartItemAction) {
		this.cartItemChange.emit(true);
	}

	public onItemAgeChange() {
		//this.onActionChange(this.cartItem.action);
		//this.cartItemChange.emit(true);
	}

	public remove() {
		this._cartService.remove(this.cartItem);
	}
}
