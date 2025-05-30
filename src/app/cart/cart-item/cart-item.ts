import {
	CustomerItem,
	Item,
	Order,
	OrderItem,
	Period,
} from "@boklisten/bl-model";
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

	getPriceInformation(): Promise<PriceInformation>;
	getTitle(): string;
	getItemId(): string;
	getCustomerItemId(): string;
	getDeliveryId(): string;
	getMovedFromOrderId(): string;
	createOrderItem(): Promise<OrderItem>;
	setAction(action: CartItemAction);
	getAction(): CartItemAction;
	getValidActions(): CartItemAction[];
	setBLID(blid: string): void;
	getBLID(): string;
	getISBN(): number;
	getItem(): Item;
}
