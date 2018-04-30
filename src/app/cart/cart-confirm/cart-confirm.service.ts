import {Injectable} from '@angular/core';
import {OrderHandlerService} from '../../order/order-handler/order-handler.service';
import {CustomerItem, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartService} from '../cart.service';
import {CustomerItemHandlerService} from '../../customer-item/customer-item-handler/customer-item-handler.service';
import {forEach} from '@angular/router/src/utils/collection';
import {CartItem} from '../cartItem';
import {CustomerService} from '../../customer/customer.service';

@Injectable()
export class CartConfirmService {

	constructor(private _orderHandlerService: OrderHandlerService, private _cartService: CartService,
	            private _customerItemHandlerService: CustomerItemHandlerService, private _customerService: CustomerService) {
	}

	public confirm(): Promise<boolean> {
		if (this._cartService.getTotalAmount() === 0) {

			if (!this._customerService.haveCustomer()) {
				throw new Error('can not add customerItems without a customer');
			}

			const customer = this._customerService.get();

			return this.confirmCartWithoutPayment(customer.detail.id);
		}

	}

	private confirmCartWithoutPayment(customerId: string): Promise<boolean> {
		if (this._cartService.getCartItemsApartOfNewOrder().length > 0) {
			return this._orderHandlerService.addOrderFromCart().then((addedOrder: Order) => {
				const orderItemsWithOrderId: {orderItem: OrderItem, orderId: string}[] = [];

				for (const orderItem of addedOrder.orderItems) {
					orderItemsWithOrderId.push({orderItem: orderItem, orderId: addedOrder.id});
				}

				const cartItemsFromCartNotApartOfNewOrder = this._cartService.getCartItemsNotApartOfNewOrder();

				if (cartItemsFromCartNotApartOfNewOrder.length > 0) {
					for (const cartItem of cartItemsFromCartNotApartOfNewOrder) {
						orderItemsWithOrderId.push({orderItem: cartItem.orderItem, orderId: cartItem.originalOrder.id});
					}
				}

				return this.addCustomerItems(orderItemsWithOrderId, customerId);

			}).catch(() => {
				throw new Error('cartConfirmService: order could not be created from cart');
			});

		} else {
			const cartItemFromCartNotApartOfNewOrder = this._cartService.getCartItemsNotApartOfNewOrder();

			if (cartItemFromCartNotApartOfNewOrder.length > 0) {
				const orderItemsWithOrderId: {orderItem: OrderItem, orderId: string}[] = [];

				for (const cartItem of cartItemFromCartNotApartOfNewOrder) {
					orderItemsWithOrderId.push({orderItem: cartItem.orderItem, orderId: cartItem.originalOrder.id});
				}

				return this.addCustomerItems(orderItemsWithOrderId, customerId);
			}
		}

		return Promise.reject('cartConfirmService: no orderItems to add');
	}


	private addCustomerItems(orderItemsWithOrderId: {orderItem: OrderItem, orderId: string}[], customerId: string): Promise<boolean> {
		return this._customerItemHandlerService.addCustomerItemsBasedOnOrderItems(orderItemsWithOrderId, customerId).then((customerItems: CustomerItem[]) => {
			console.log('the customerItems', customerItems);
			return true;
		}).catch(() => {
			throw new Error('cartConfirmService: could not add customer items');
		});
	}

	public addOrder(): Promise<Order> {
		return this._orderHandlerService.addOrderFromCart();
	}

}
