import {
	CustomerItem,
	Item,
	Order,
	OrderItem,
	Period
} from "@wizardcoder/bl-model";
import { CartItemAction } from "./cart-item-action";
import { PriceInformation } from "../../price/price-information";
import { Subscribable } from "../../bl-common/subscribable/subscribable";

export interface CartItem extends Subscribable {
	item?: Item;
	orderItem?: OrderItem;
	action?: CartItemAction;
	period?: Period; // if the action requires a period
	customerItem?: CustomerItem;
	originalOrder?: Order;
	originalOrderItem?: OrderItem;

	getPriceInformation(): PriceInformation;
	getTitle(): string;
	createOrderItem(): OrderItem;
	setAction(action: CartItemAction);
	getAction(): CartItemAction;
	getValidActions(): CartItemAction[];
}
