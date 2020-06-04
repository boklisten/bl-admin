import { Injectable } from "@angular/core";
import { Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { CartService } from "../../../cart/cart.service";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";
import { CustomerDetailService } from "../../../customer/customer-detail/customer-detail.service";
import { CustomerOrderService } from "../customer-order.service";

@Injectable({
	providedIn: "root"
})
export class CustomerOrderItemListService {
	private _customerOrderItems: {
		orderItem: OrderItem;
		order: Order;
	}[];
	private _customerOrderItemList$: Subject<boolean>;
	private _wait$: Subject<boolean>;
	private fetching: boolean;

	constructor(
		private _cartService: CartService,
		private _customerDetailService: CustomerDetailService,
		private _customerOrderService: CustomerOrderService
	) {
		this._customerOrderItemList$ = new Subject<boolean>();
		this._wait$ = new Subject<boolean>();

		this._customerOrderItems = [];
		this.onCustomerChange();
		this.onCartConfirmed();
	}

	private onCustomerChange() {
		this._customerDetailService.onCustomerDetailChange().subscribe(() => {
			this.fetchOrdersIfCustomer();
		});
	}

	onWait(): Observable<boolean> {
		return this._wait$.asObservable();
	}

	public reload() {
		this.fetchOrdersIfCustomer();
	}

	private fetchOrdersIfCustomer() {
		this._customerOrderItems = [];
		if (
			this._customerDetailService.haveCustomerDetail() &&
			!this.fetching
		) {
			this.fetchOrderedItems()
				.then(customerOrderItems => {
					this._customerOrderItems = customerOrderItems;
					this._customerOrderItemList$.next(true);
				})
				.catch(e => {});
		}
	}

	public onCustomerOrderItemListChange() {
		return this._customerOrderItemList$.asObservable();
	}

	private onCartConfirmed() {
		this._cartService.onCartConfirm().subscribe(() => {
			this._customerOrderItems = [];
		});
	}

	public getCustomerOrderItems(): {
		orderItem: OrderItem;
		order: Order;
	}[] {
		return this._customerOrderItems;
	}

	/*
	public getItemWithIsbn(isbn: string) {
		for (const customerOrderItem of this._customerOrderItems) {
			if (
				customerOrderItem.item.info &&
				customerOrderItem.item.info["isbn"]
			) {
				if (customerOrderItem.item.info["isbn"].toString() === isbn) {
					return customerOrderItem;
				}
			}
		}
	}
  */
	/*
	public async addItemWithIsbn(isbn: string): Promise<boolean> {
		if (this._customerOrderItems.length <= 0) {
			this._customerOrderItems = await this.fetchOrderedItems();
		}

		const customerOrderItem = this.getItemWithIsbn(isbn);

		if (customerOrderItem) {
			if (
				!this._cartService.contains(customerOrderItem.orderItem
					.item as string)
			) {
				this._cartService.addOrderItem(
					customerOrderItem.orderItem,
					customerOrderItem.order,
					customerOrderItem.item
				);
			}
			return true;
		}

		return false;
	}
  */

	public async fetchOrderedItems(): Promise<
		{ orderItem: OrderItem; order: Order; item: Item }[]
	> {
		this._customerOrderItems = [];

		this.fetching = true;
		const customerOrderItems = [];
		this._wait$.next(true);
		const customerDetail = this._customerDetailService.getCustomerDetail();

		if (!customerDetail) {
			throw new Error("no customer detail");
		}

		const orders = await this._customerOrderService.getCustomerOrders();

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

		this._customerOrderItems = customerOrderItems;
		this._customerOrderItemList$.next(true);
		this._wait$.next(false);
		this.fetching = false;
		return customerOrderItems;
	}
}
