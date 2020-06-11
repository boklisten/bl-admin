import {
	CustomerItem,
	Item,
	Order,
	OrderItem,
	Period
} from "@wizardcoder/bl-model";
import { CartItemAction } from "./cart-item-action";

export class CartItem {
	item: Item;
	orderItem: OrderItem;
	action: CartItemAction;
	period?: Period; // if the action requires a period
	customerItem?: CustomerItem;
	originalOrder?: Order;
	originalOrderItem?: OrderItem;
	private _action: CartItemAction;

	constructor(private title: string) {}

	public getPriceInformation(): {
		amount: number;
		unitPrice: number;
		taxRate: number;
		taxAmount: number;
		payLater: number;
	} {
		throw "cartItem.getPriceInformation(): not implemented";
	}

	public getTitle(): string {
		throw "cartItem.getTitle(): not implemented";
	}

	public createOrderItem(): OrderItem {
		throw "cartItem.createOrderItem(): not implemented";
	}

	public setAction(action: CartItemAction) {
		this._action = action;
	}

	public getAction(): CartItemAction {
		return this._action;
	}

	public getValidActions(): CartItemAction[] {
		throw "cartItem.getValidActions(): not implemented";
	}
}
