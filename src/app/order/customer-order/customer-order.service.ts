import { Injectable } from "@angular/core";
import { Order, OrderItem, Payment, UserDetail } from "@wizardcoder/bl-model";
import { OrderService, PaymentService } from "@wizardcoder/bl-connect";
import { CustomerDetailService } from "../../customer/customer-detail/customer-detail.service";
import { Subject, Observable } from "rxjs";

@Injectable()
export class CustomerOrderService {
	constructor(
		private _customerDetailService: CustomerDetailService,
		private _orderService: OrderService
	) {}

	public async getOrders(userDetail: UserDetail): Promise<Order[]> {
		return this._orderService.get({ query: `?customer=${userDetail.id}` });
	}

	public getCustomerOrders(): Promise<Order[]> {
		const customerDetail = this._customerDetailService.getCustomerDetail();

		return this._orderService
			.get({ query: `?customer=${customerDetail.id}` })

			.then((orders: Order[]) => {
				return orders;
			})
			.catch(() => {
				throw new Error("customerOrderService: could not get orders");
			});
	}
}
