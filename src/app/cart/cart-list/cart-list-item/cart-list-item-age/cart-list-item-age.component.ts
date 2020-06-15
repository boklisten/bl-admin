import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { CartItem } from "../../../cart-item/cart-item";
import { CartItemAction } from "../../../cart-item/cart-item-action";
import { OrderItemHelperService } from "../../../order-item-helper/order-item-helper.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-cart-list-item-age",
	templateUrl: "./cart-list-item-age.component.html",
	styleUrls: ["./cart-list-item-age.component.scss"]
})
export class CartListItemAgeComponent implements OnInit, OnDestroy {
	@Input() cartItem: CartItem;
	public cartItemAction: CartItemAction;
	private cartItem$: Subscription;

	constructor() {}

	ngOnInit() {
		this.cartItemAction = this.cartItem.getAction();
		this.cartItemAction.age = "new";
		this.handleCartItemChange();
	}

	ngOnDestroy() {
		this.cartItem$.unsubscribe();
	}

	public onAgeChange() {
		this.cartItem.setAction(this.cartItemAction);
	}

	private handleCartItemChange() {
		this.cartItem$ = this.cartItem.subscribe(() => {
			this.cartItemAction = this.cartItem.getAction();
		});
	}
}
