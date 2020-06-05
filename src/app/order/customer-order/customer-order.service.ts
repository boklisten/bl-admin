import { Injectable } from "@angular/core";
import { Order, OrderItem, Payment, UserDetail } from "@wizardcoder/bl-model";
import { OrderService, PaymentService } from "@wizardcoder/bl-connect";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";
import { Subject, Observable } from "rxjs";

@Injectable()
export class CustomerOrderService {
	private _orders: Order[];

	constructor(
		private _customerDetailService: CustomerDetailService,
		private _orderService: OrderService
	) {}

	public async getOrders(userDetail: UserDetail): Promise<Order[]> {
		let orders: Order[] = [];

		try {
			orders = await this._orderService.get({
				query: `?placed=true&customer=${userDetail.id}`
			});
		} catch (e) {
			throw e;
		}

		this._orders = this.sortOrders(orders);
		return this._orders;
	}

	public getCustomerOrders(): Promise<Order[]> {
		return new Promise<Order[]>((resolve, reject) => {
			this._customerDetailService
				.subscribe((customerDetail: UserDetail) => {
					this.getOrders(customerDetail)
						.then(orders => {
							resolve(orders);
						})
						.catch(e => reject(e));
				})
				.unsubscribe();
		});
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
