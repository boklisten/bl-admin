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


	public addOrderFromCart(): Promise<Order> {
		return new Promise((resolve, reject) => {
			let order: Order;

			try {
				order = this.convertCartToOrder();
			} catch (e) {
				reject(new Error('orderHandlerService: could not convert cart to order: ' + e));
			}

			resolve(order);

			//console.log('orderHandlerService: ALERT: should uncomment');

			this._orderService.add(order).then((addedOrder: Order) => {
				resolve(addedOrder);
			}).catch((addOrderError: BlApiError) => {
				reject(new Error('orderHandlerService: could not add order: ' + addOrderError));
			});
		});
	}

	private convertCartToOrder(): Order {
		const cartItems = this._cartService.getCartItemsApartOfNewOrder();

		const orderItems: OrderItem[] = [];

		console.log('the cart items' , cartItems);

		for (const cartItem of cartItems) {
			if (cartItem.originalOrder && cartItem.originalOrderItem && cartItem.orderItem.amount === 0) {
				break;
			}

			orderItems.push(this.createOrderItemBasedOnCartItem(cartItem));
		}

		if (orderItems.length <= 0) {
			throw new Error('could not create order, no orderItems valid');
		}

		return this.createOrder(orderItems);

	}

	private createOrder(orderItems: OrderItem[]): Order {
		return {
			amount: this.calculateOrderAmount(orderItems),
			orderItems: orderItems,
			branch: this._branchStoreService.getCurrentBranch().id,
			customer: (this._customerService.haveCustomer()) ? this._customerService.get().detail.id : null,
			byCustomer: false,
			employee: this._userService.getUserDetailId()
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
