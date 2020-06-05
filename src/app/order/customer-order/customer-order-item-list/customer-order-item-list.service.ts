import { Injectable } from "@angular/core";
import { Order, OrderItem } from "@wizardcoder/bl-model";
import { CartService } from "../../../cart/cart.service";
import { ReplaySubject, Subscription } from "rxjs";
import { CustomerOrderService } from "../customer-order.service";

type CustomerOrderItem = {
	order: Order;
	orderItem: OrderItem;
};

@Injectable({
	providedIn: "root"
})
export class CustomerOrderItemListService {
	private _customerOrderItems$: ReplaySubject<CustomerOrderItem[]>;

	constructor(
		private _cartService: CartService,
		private _customerOrderService: CustomerOrderService
	) {
		this._customerOrderItems$ = new ReplaySubject(1);
		this.onCartConfirmed();
		this.onCustomerOrderServiceChange();
	}

	public subscribe(
		func: (customerOrderItems: CustomerOrderItem[]) => void
	): Subscription {
		return this._customerOrderItems$.asObservable().subscribe(func);
	}

	private onCustomerOrderServiceChange(): void {
		this._customerOrderService.subscribe((orders: Order[]) => {
			let customerOrderItems = this.filterOrderdItems(orders);
			this.setOrderedItems(customerOrderItems);
		});
	}

	private onCartConfirmed() {
		this._cartService.onCartConfirm().subscribe(() => {
			this.setOrderedItems([]);
		});
	}

	private setOrderedItems(customerOrderItems) {
		this._customerOrderItems$.next(customerOrderItems);
	}

	private filterOrderdItems(
		orders: Order[]
	): { order: Order; orderItem: OrderItem }[] {
		let customerOrderItems = [];

		for (const order of orders) {
			if (order.orderItems) {
				for (const orderItem of order.orderItems) {
					if (order.handoutByDelivery || !order.byCustomer) {
						continue;
					}

					if (orderItem.handout) {
						continue;
					}

					if (orderItem.movedToOrder) {
						continue;
					}

					if (
						orderItem.type === "rent" ||
						orderItem.type === "buy" ||
						orderItem.type === "partly-payment"
					) {
						customerOrderItems.push({
							order: order,
							orderItem: orderItem
						});
					}
				}
			}
		}
		return customerOrderItems;
	}
}
