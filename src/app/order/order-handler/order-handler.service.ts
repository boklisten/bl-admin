import {Injectable} from '@angular/core';
import {CartService} from '../../cart/cart.service';
import {BlApiError, Order, OrderItem} from '@wizardcoder/bl-model';
import {CartItem} from '../../cart/cartItem';
import {BranchStoreService} from '../../branch/branch-store.service';
import {CustomerService} from '../../customer/customer.service';
import {UserService} from '../../user/user.service';
import {OrderService} from '@wizardcoder/bl-connect';

@Injectable()
export class OrderHandlerService {

	constructor(private _cartService: CartService, private _branchStoreService: BranchStoreService,
	            private _customerService: CustomerService, private _userService: UserService, private _orderService: OrderService) {
	}

	public addOrder(cartItems: CartItem[], handoutByDelivery: boolean): Promise<Order> {
		return new Promise((resolve, reject) => {
			let order: Order;

			try {
				order = this.convertCartItemsToOrder(cartItems);
				order.handoutByDelivery = handoutByDelivery;

			} catch (e) {
				return reject(new Error('orderHandlerService: could not convert cart to order: ' + e));
			}

			this._orderService.add(order).then((addedOrder: Order) => {
				resolve(addedOrder);
			}).catch((addOrderError: BlApiError) => {
				reject(new Error('orderHandlerService: could not add order: ' + addOrderError));
			});
		});

	}

	public placeOrder(order: Order): Promise<boolean> {
		return this._orderService.update(order.id, {placed: true}).then((placedOrder: Order) => {
			return true;
		}).catch((placeOrderError) => {
			throw new Error('orderHandlerService: could not place order' + placeOrderError);
		});
	}

	private convertCartItemsToOrder(cartItems: CartItem[]): Order {

		const orderItems: OrderItem[] = [];

		for (const cartItem of cartItems) {
			orderItems.push(this.createOrderItemBasedOnCartItem(cartItem));
		}

		if (orderItems.length <= 0) {
			throw new Error('orderHandlerService: could not create order, no orderItems valid from cart');
		}

		return this.createOrder(orderItems);
	}

	private createOrder(orderItems: OrderItem[]): Order {
		return {
			amount: this.calculateOrderAmount(orderItems),
			orderItems: orderItems,
			branch: this._branchStoreService.getCurrentBranch().id,
			customer: (this._customerService.haveCustomer()) ? this._customerService.getCustomerDetail().id : null,
			byCustomer: false,
			employee: this._userService.getUserDetailId(),
			viewableFor: (this._customerService.haveCustomer()) ? [this._customerService.getCustomerDetail().blid] : null
		} as Order;
	}

	private createOrderItemBasedOnCartItem(cartItem: CartItem): OrderItem {
		return cartItem.orderItem;
	}

	private calculateOrderAmount(orderItems: OrderItem[]): number {
		let total = 0;

		orderItems.forEach((orderItem: OrderItem) => {
			total += orderItem.amount;
		});

		return total;
	}

}
