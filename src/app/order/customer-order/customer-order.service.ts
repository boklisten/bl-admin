import { Injectable } from "@angular/core";
import { Order, OrderItem, Payment, UserDetail } from "@wizardcoder/bl-model";
import { OrderService, PaymentService } from "@wizardcoder/bl-connect";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";
import { Subject, Subscription, ReplaySubject } from "rxjs";

@Injectable()
export class CustomerOrderService {
	private _orders: Order[];
	private _orders$: ReplaySubject<Order[]>;
	private _wait$: Subject<boolean>;

	constructor(
		private _customerDetailService: CustomerDetailService,
		private _orderService: OrderService
	) {
		this._orders$ = new ReplaySubject(1);
		this._wait$ = new Subject();
		this.onCustomerDetailChange();
	}

	public subscribe(func: (orders: Order[]) => void): Subscription {
		return this._orders$.asObservable().subscribe(func);
	}

	public onWait(func: (wait: boolean) => void): Subscription {
		return this._wait$.asObservable().subscribe(func);
	}

	private get(userDetailId: string) {
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

	private onCustomerDetailChange() {
		this._customerDetailService.subscribe((customerDetail: UserDetail) => {
			this.setOrders([]); // clear before change
			this._wait$.next(true);
			this.get(customerDetail.id);
		});
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
