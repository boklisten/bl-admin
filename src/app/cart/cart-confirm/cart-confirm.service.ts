import {Injectable} from '@angular/core';
import {OrderHandlerService} from '../../order/order-handler/order-handler.service';
import {CustomerItem, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartService} from '../cart.service';
import {CustomerItemHandlerService} from '../../customer-item/customer-item-handler/customer-item-handler.service';
import {forEach} from '@angular/router/src/utils/collection';
import {CartItem} from '../cartItem';
import {CustomerService} from '../../customer/customer.service';
import {PaymentHandlerService} from '../../payment/payment-handler/payment-handler.service';

@Injectable()
export class CartConfirmService {

	constructor(private _orderHandlerService: OrderHandlerService, private _cartService: CartService,
	            private _customerItemHandlerService: CustomerItemHandlerService, private _customerService: CustomerService,
	            private _paymentHandlerService: PaymentHandlerService) {
	}

	public addOrder(): Promise<Order> {
		return this._orderHandlerService.addOrder(this._cartService.getCart());
	}

	public placeOrder(order: Order): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (order.amount !== 0) {
				this._paymentHandlerService.addPayments(order).then(() => {
					this._orderHandlerService.placeOrder(order).then(() => {
						resolve(true);
					}).catch((placeOrderError) => {
						reject(new Error('cartConfirmService: could not place order' + placeOrderError))
					});
				}).catch((addPaymentError) => {
					reject(new Error('cartConfirmService: could not add payments: ' + addPaymentError));
				});
			} else {
				this._orderHandlerService.placeOrder(order).then(() => {
					resolve(true);
				}).catch((placeOrderError) => {
					console.log('cartConfirmService: could not place order: ' + placeOrderError);
				});
			}
		});
	}

	public addOrUpdateCustomerItems(order: Order): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const customerItemsToCreate: {order: Order, orderItem: OrderItem}[] = [];
			const orderItemsToUpdate: OrderItem[] = [];

			if (order) {
				for (const orderItem of order.orderItems) {
					if (!orderItem.customerItem && orderItem.type !== 'buy' && orderItem.type !== 'sell') {
						customerItemsToCreate.push({orderItem: orderItem, order: order});
					} else if (orderItem.customerItem) {
						orderItemsToUpdate.push(orderItem);
					}
				}
			}

			const updateAndCreateCustomerItemPromiseArr: Promise<CustomerItem[]>[] = [];

			if (orderItemsToUpdate.length > 0) {
				updateAndCreateCustomerItemPromiseArr.push(this._customerItemHandlerService.updateCustomerItems(orderItemsToUpdate));
			}

			if (customerItemsToCreate. length > 0) {
				updateAndCreateCustomerItemPromiseArr.push(this._customerItemHandlerService.addCustomerItems(customerItemsToCreate));
			}

			Promise.all(updateAndCreateCustomerItemPromiseArr).then((customerItems) => {
				resolve(true);
			}).catch((e) => {
				reject(new Error('cartConfirmService: could not create or update customerItems' + e));
			});
		});

	}



	private updateOrCreateCustomerItemsByCartItems(cartItems: CartItem[]): Promise<boolean> {
		console.log('update or create customerItems by cartItems');
		return new Promise((resolve, reject) => {
			for (const cartItem of cartItems) {
				console.log('should update or create customerItem for', cartItems);
			}
		});
	}

	private updateOrCreateCustomerItemsByOrder(order: Order): Promise<boolean> {
		console.log('update or create customerItem by order');
		return new Promise((resolve, reject) => {
			for (const orderItem of order.orderItems) {
				console.log('should update or create customerItem for', orderItem.title);
			}
		});
	}

	private getCartItemsForOrder(): CartItem[] {
		const cart = this._cartService.getCart();
		const cartItemsForOrder: CartItem[] = [];

		for (const cartItem of cart) {
			if (cartItem.orderItem.amount !== 0
				|| (cartItem.orderItem.amount === 0 && !cartItem.originalOrderItem && !cartItem.originalOrderItem && !cartItem.customerItem)) {
				cartItemsForOrder.push(cartItem);
			}
		}

		return cartItemsForOrder;
	}

	private getCartItemsForUpdate(): CartItem[] {
		const cart = this._cartService.getCart();
		const cartItemsForUpdate: CartItem[] = [];

		for (const cartItem of cart) {
			if (cartItem.orderItem.amount === 0 && ((cartItem.originalOrderItem && cartItem.originalOrderItem) || cartItem.customerItem)) {
				cartItemsForUpdate.push(cartItem);
			}
		}

		return cartItemsForUpdate;
	}



}
