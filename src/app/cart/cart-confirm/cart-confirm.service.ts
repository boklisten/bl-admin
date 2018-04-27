import {Injectable} from '@angular/core';
import {OrderHandlerService} from '../../order/order-handler/order-handler.service';
import {CustomerItem, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartService} from '../cart.service';
import {CustomerItemHandlerService} from '../../customer-item/customer-item-handler/customer-item-handler.service';
import {forEach} from '@angular/router/src/utils/collection';
import {CartItem} from '../cartItem';

@Injectable()
export class CartConfirmService {

	constructor(private _orderHandlerService: OrderHandlerService, private _cartService: CartService,
	            private _customerItemHandlerService: CustomerItemHandlerService) {
	}

	public confirm() {

	}

	public confirmCartWithoutPayment(): Promise<boolean> {
		if (this._cartService.getCartItemsApartOfNewOrder().length > 0) {
			return this._orderHandlerService.addOrderFromCart().then((addedOrder: Order) => {
				const orderItems: OrderItem[] = [];

				for (const orderItem of addedOrder.orderItems) {
					orderItems.push(orderItem);
				}

				const cartItemsFromCartNotApartOfNewOrder = this._cartService.getCartItemsNotApartOfNewOrder();

				if (cartItemsFromCartNotApartOfNewOrder.length > 0) {
					for (const cartItem of cartItemsFromCartNotApartOfNewOrder) {
						orderItems.push(cartItem.orderItem);
					}
				}

				return this.addCustomerItems(orderItems);

			}).catch(() => {
				throw new Error('cartConfirmService: order could not be created from cart');
			});

		} else {
			const cartItemFromCartNotApartOfNewOrder = this._cartService.getCartItemsNotApartOfNewOrder();

			if (cartItemFromCartNotApartOfNewOrder.length > 0) {
				const orderItems: OrderItem[] = [];

				for (const cartItem of cartItemFromCartNotApartOfNewOrder) {
					orderItems.push(cartItem.orderItem);
				}

				return this.addCustomerItems(orderItems);
			}
		}

		return Promise.reject('cartConfirmService: no orderItems to add');
	}


	private addCustomerItems(orderItems: OrderItem[]): Promise<boolean> {
		return this._customerItemHandlerService.addCustomerItemsBasedOnOrderItems(orderItems).then((customerItems: CustomerItem[]) => {
			return true;
		}).catch(() => {
			throw new Error('cartConfirmService: could not add customer items');
		});
	}

	public addOrder(): Promise<Order> {
		return this._orderHandlerService.addOrderFromCart();
	}

}
