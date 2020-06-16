import { Component, Input, OnInit } from "@angular/core";
import { CartItem } from "../../../cart-item/cart-item";
import { CartItemAction } from "../../../cart-item/cart-item-action";

@Component({
	selector: "app-cart-list-item-action",
	templateUrl: "./cart-list-item-action.component.html",
	styleUrls: ["./cart-list-item-action.component.scss"]
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	public updating: boolean;

	public actionList: CartItemAction[];
	public selectedAction: CartItemAction;

	constructor() {
		this.actionList = [];
	}

	ngOnInit() {
		this.actionList = this.cartItem.getValidActions();
		this.selectedAction = this.actionList[0];
		this.cartItem.setAction(this.selectedAction);
	}

	public onActionChange(action: CartItemAction) {
		this.selectedAction = action;
		this.cartItem.setAction(this.selectedAction);
	}
}
