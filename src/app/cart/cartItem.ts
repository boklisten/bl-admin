import {
	CustomerItem,
	Item,
	Order,
	OrderItem,
	Period
} from "@wizardcoder/bl-model";
import { CartItemAction } from "./cartItemAction";

export class CartItem {
	item: Item;
	orderItem: OrderItem;
	action: CartItemAction;
	period?: Period; // if the action requires a period
	customerItem?: CustomerItem;
	originalOrder?: Order;
	originalOrderItem?: OrderItem;
}
