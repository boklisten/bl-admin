import { Injectable } from "@angular/core";
import { Order, OrderItem, Payment, UserDetail } from "@wizardcoder/bl-model";
import { OrderService, PaymentService } from "@wizardcoder/bl-connect";
import { Subject, Subscription, ReplaySubject } from "rxjs";
import { CustomerService } from "../../customer/customer.service";

@Injectable()
export class CustomerOrderService {
	private _orders: Order[];
	private _orders$: ReplaySubject<Order[]>;
	private _wait$: Subject<boolean>;

	constructor(
		private _customerService: CustomerService,
		private _orderService: OrderService
	) {
		this._orders$ = new ReplaySubject(1);
		this._wait$ = new Subject();
		this.onCustomerChange();
		this.onCustomerClear();
		this.onCustomerWaitChange();
	}

	public subscribe(func: (orders: Order[]) => void): Subscription {
		return this._orders$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	private get(userDetailId: string) {
		this._wait$.next(true);
		this._orderService
			.get({
				query: `?placed=true&customer=${userDetailId}`
			})
			.then(orders => {
				orders = this.sortOrders(orders);
				this.setOrders(orders);
			})
			.catch(() => {
				this.setOrders([]);
			});
	}

	private onCustomerChange() {
		this._customerService.subscribe((customerDetail: UserDetail) => {
			this.get(customerDetail.id);
		});
	}

	private onCustomerWaitChange() {
		this._customerService.onWait(wait => {
			if (wait) {
				this._wait$.next(true);
			}
		});
	}
	private onCustomerClear() {
		this._customerService.onClear(cleared => {
			if (cleared) {
				this.clear();
			}
		});
	}

	private clear() {
		this.setOrders([]);
		this._wait$.next(false);
	}

	private setOrders(orders: Order[]) {
		this._orders = orders;
		this._orders$.next(orders);
		this._wait$.next(false);
	}

	public isItemOrdered(itemId: string): boolean {
		try {
			this.getOrderedItem(itemId);
			return true;
		} catch (e) {
			return false;
		}
	}

	public getOrderedItem(
		itemId: string
	): { orderItem: OrderItem; order: Order } {
		for (const order of this._orders) {
			for (const orderItem of order.orderItems) {
				if (orderItem.item === itemId) {
					if (
						(orderItem.type === "rent" ||
							orderItem.type === "buy" ||
							orderItem.type === "partly-payment") &&
						!orderItem.customerItem &&
						!orderItem.movedToOrder &&
						!orderItem.handout
					) {
						return { orderItem: orderItem, order: order };
					}
				}
			}
		}

		throw new Error("customerService: did not have ordered item");
	}

	private sortOrders(orders: Order[]): Order[] {
		return orders.sort((a, b) => {
			return (
				new Date(b.creationTime).getTime() -
				new Date(a.creationTime).getTime()
			);
		});
	}
}
