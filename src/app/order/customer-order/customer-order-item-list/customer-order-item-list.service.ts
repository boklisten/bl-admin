import { Injectable } from "@angular/core";
import { BranchStoreService } from "../../../branch/branch-store.service";
import { CustomerService } from "../../../customer/customer.service";
import {
	DeliveryService,
	ItemService,
	OrderService
} from "@wizardcoder/bl-connect";
import { Item, Order, OrderItem } from "@wizardcoder/bl-model";
import { CartService } from "../../../cart/cart.service";
import { Subject } from "rxjs/internal/Subject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
	providedIn: "root"
})
export class CustomerOrderItemListService {
	private _customerOrderItems: {
		orderItem: OrderItem;
		order: Order;
		item: Item;
	}[];
	private _customerOrderItemList$: Subject<boolean>;
	private _wait$: Subject<boolean>;

	constructor(
		private _branchStoreService: BranchStoreService,
		private _orderService: OrderService,
		private _itemService: ItemService,
		private _cartService: CartService,
		private _customerService: CustomerService
	) {
		this._customerOrderItems = [];
		this.onCustomerChange();
		this.onCartConfirmed();
		this._customerOrderItemList$ = new Subject<boolean>();
		this._wait$ = new Subject<boolean>();

		if (this._customerService.haveCustomer()) {
			this.fetchOrderedItems()
				.then(customerOrderItems => {
					this._customerOrderItems = customerOrderItems;
				})
				.catch(err => {
					console.log(
						"CustomerOrderItemListService: could not get customer order items",
						err
					);
				});
		}
	}

	private onCustomerChange() {
		this._customerService.onCustomerChange().subscribe(() => {
			this.fetchOrderedItems()
				.then(customerOrderItems => {
					this._customerOrderItems = customerOrderItems;
					this._customerOrderItemList$.next(true);
				})
				.catch(err => {
					console.log(
						"CustomerOrderItemListService: could not get customer order items"
					);
				});
		});
	}

	onWait(): Observable<boolean> {
		return this._wait$.asObservable();
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
		item: Item;
	}[] {
		return this._customerOrderItems;
	}

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
			console.log("we found order item");
			return true;
		}

		return false;
	}

	public async fetchOrderedItems(): Promise<
		{ orderItem: OrderItem; order: Order; item: Item }[]
	> {
		this._customerOrderItems = [];
		// this._customerOrderItemList$.next(true);
		const customerOrderItems = [];
		this._wait$.next(true);
		const customerDetail = this._customerService.getCustomerDetail();
		const orders = await this._orderService.getManyByIds(
			customerDetail.orders as string[]
		);

		for (const order of orders) {
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

				if (orderItem.type === "rent" || orderItem.type === "buy") {
					const item = await this._itemService.getById(
						orderItem.item as string
					);
					customerOrderItems.push({
						order: order,
						orderItem: orderItem,
						item: item
					});
				}
			}
		}

		this._customerOrderItems = customerOrderItems;
		this._wait$.next(false);
		this._customerOrderItemList$.next(true);
		return customerOrderItems;
	}
}
