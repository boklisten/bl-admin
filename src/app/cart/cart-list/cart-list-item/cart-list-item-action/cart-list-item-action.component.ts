import { Component, Input, OnInit } from "@angular/core";
import { CartItem } from "../../../cart-item/cart-item";
import { CartItemAction } from "../../../cart-item/cart-item-action";

@Component({
	selector: "app-cart-list-item-action",
	templateUrl: "./cart-list-item-action.component.html",
	styleUrls: ["./cart-list-item-action.component.scss"],
})
export class CartListItemActionComponent implements OnInit {
	@Input() cartItem: CartItem;
	public updating: boolean;

	public actionList: CartItemAction[];
	public selectedAction: CartItemAction;
	public selectedActionName: string;

	constructor() {
		this.actionList = [];
	}

	ngOnInit() {
		this.actionList = this.cartItem.getValidActions();
		this.selectedAction = this.cartItem.getAction();
		this.selectedActionName = this.getActionName(this.selectedAction);
		this.cartItem.setAction(this.selectedAction);
	}

	public onActionChange(action: CartItemAction) {
		this.selectedActionName = this.getActionName(action);
		this.selectedAction = action;
		this.cartItem.setAction(this.selectedAction);
	}

	public getActionName(action: CartItemAction): string {
		return action.action + action.period;
	}
}
