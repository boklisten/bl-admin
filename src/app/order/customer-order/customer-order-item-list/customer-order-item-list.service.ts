import { Injectable } from "@angular/core";
import { Order, OrderItem } from "@boklisten/bl-model";
import { CartService } from "../../../cart/cart.service";
import { ReplaySubject, Subscription, Subject } from "rxjs";
import { CustomerOrderService } from "../customer-order.service";

type CustomerOrderItem = {
	order: Order;
	orderItem: OrderItem;
};

@Injectable({
	providedIn: "root",
})
export class CustomerOrderItemListService {
	private _customerOrderItems$: ReplaySubject<CustomerOrderItem[]>;
	private _wait$: Subject<boolean>;
	private _customerOrderItems: CustomerOrderItem[];

	constructor(
		private _cartService: CartService,
		private _customerOrderService: CustomerOrderService
	) {
		this._customerOrderItems$ = new ReplaySubject(1);
		this._wait$ = new Subject();
		this._customerOrderItems = [];

		this.onCartConfirmed();
		this.onCustomerOrderServiceChange();
		this.onCustomerOrderWaitChange();
	}

	public subscribe(
		func: (customerOrderItems: CustomerOrderItem[]) => void
	): Subscription {
		return this._customerOrderItems$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	public getByItemId(itemId: string): CustomerOrderItem {
		for (let customerOrderItem of this._customerOrderItems) {
			if (customerOrderItem.orderItem.item === itemId) {
				return customerOrderItem;
			}
		}
		throw new ReferenceError(`item id ${itemId} not found`);
	}

	private onCustomerOrderServiceChange(): void {
		this._customerOrderService.subscribe((orders: Order[]) => {
			let customerOrderItems = this.filterOrderdItems(orders);
			this.setOrderedItems(customerOrderItems);
		});
	}

	private onCustomerOrderWaitChange(): void {
		this._customerOrderService.onWait((wait) => {
			this._wait$.next(wait);
		});
	}

	private onCartConfirmed() {
		this._cartService.onCartConfirm().subscribe(() => {
			this.setOrderedItems([]);
		});
	}

	private setOrderedItems(customerOrderItems) {
		this._customerOrderItems = customerOrderItems;
		this._customerOrderItems$.next(customerOrderItems);
		this._wait$.next(false);
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
							orderItem: orderItem,
						});
					}
				}
			}
		}
		return customerOrderItems;
	}
}
