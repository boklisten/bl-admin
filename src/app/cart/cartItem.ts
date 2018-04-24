import {CustomerItem, Item, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartItemAction} from './cartItemAction';


export class CartItem {
	item: Item;
	orderItem: OrderItem;
	action: CartItemAction;
	customerItem?: CustomerItem;
	originalOrder?: Order;
	originalOrderItem?: OrderItem;
}
