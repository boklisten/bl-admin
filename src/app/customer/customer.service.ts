import { Injectable } from "@angular/core";
import { CustomerDetailService } from "./customer-detail/customer-detail.service";
import { Observable, Subject } from "rxjs";
import { Customer } from "./customer";
import { CustomerOrderService } from "../order/customer-order/customer-order.service";
import {
	Order,
	OrderItem,
	UserDetail,
	CustomerItem
} from "@wizardcoder/bl-model";
import {
	CustomerItemService,
	UserDetailService
} from "@wizardcoder/bl-connect";

@Injectable({ providedIn: "root" })
export class CustomerService {
	private _customerChange$: Subject<boolean>;
	private _customer: Customer;

	constructor(
		private _customerDetailService: CustomerDetailService,
		private _customerOrderService: CustomerOrderService,
		private _customerItemService: CustomerItemService,
		private userDetailService: UserDetailService
	) {
		this._customerChange$ = new Subject<boolean>();
		this._customer = null;
		this.handleCustomerDetailChange();
	}

	public get(): Customer {
		return this._customer;
	}

	public getCustomerDetail(): UserDetail {
		return this._customer ? this._customer.detail : null;
	}

	public haveCustomer(): boolean {
		return !!this._customer;
	}

	public reloadCustomer() {
		this._customerDetailService.reloadCustomerDetail();
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
		for (const order of this._customer.orders) {
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

	public isActiveCustomerItem(itemId: string): boolean {
		try {
			this.getActiveCustomerItem(itemId);
			return true;
		} catch (e) {}
		return false;
	}

	public getActiveCustomerItem(itemId: string): CustomerItem {
		for (let customerItem of this._customer.customerItems) {
			if (customerItem.item === itemId) {
				if (
					!customerItem.returned &&
					!customerItem.buyout &&
					!customerItem.buyback
				)
					return customerItem;
			}
		}

		throw new Error("not found");
	}

	public onCustomerChange(): Observable<boolean> {
		return this._customerChange$;
	}

	public clear() {
		this._customer = null;
		this._customerDetailService.clearCustomerDetail();
	}

	private handleCustomerDetailChange() {
		this._customerDetailService
			.onCustomerDetailChange()
			.subscribe(async () => {
				const customerDetail = this._customerDetailService.getCustomerDetail();
				if (!customerDetail) {
					this._customer = null;
					this._customerChange$.next(true);
					return;
				}

				let orders;
				let customerItems;

				try {
					orders = await this._customerOrderService.getOrders(
						customerDetail
					);
				} catch (e) {
					this._customer = null;
					this._customerChange$.next(true);
				}

				try {
					customerItems = await this._customerItemService.get({
						query: `?customer=${customerDetail.id}`
					});
				} catch (e) {
					this._customer = null;
					this._customerChange$.next(true);
				}

				this.setCustomer(customerDetail, orders, customerItems);
			});
	}

	private setCustomer(
		detail: UserDetail,
		orders?: Order[],
		customerItems?: CustomerItem[]
	) {
		this._customer = {
			detail: detail,
			orders: orders ? orders : null,
			customerItems: customerItems ? customerItems : null
		};

		this._customerChange$.next(true);
	}
}
