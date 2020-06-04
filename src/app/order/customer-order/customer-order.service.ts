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
		try {
			this._orders = await this._orderService.get({
				query: `?customer=${userDetail.id}`
			});
			return this._orders;
		} catch (e) {
			throw e;
		}
	}

	public getCustomerOrders(): Promise<Order[]> {
		const customerDetail = this._customerDetailService.getCustomerDetail();

		return this._orderService
			.get({ query: `?customer=${customerDetail.id}` })

			.then((orders: Order[]) => {
				this._orders = orders;
				return this._orders;
			})
			.catch(() => {
				throw new Error("customerOrderService: could not get orders");
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
}
