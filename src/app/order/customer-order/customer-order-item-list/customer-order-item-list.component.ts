import { Component, OnInit, OnDestroy } from "@angular/core";
import { Item, Order, OrderItem, UserDetail } from "@boklisten/bl-model";
import { CustomerOrderItemListService } from "./customer-order-item-list.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-order-item-list",
	templateUrl: "./customer-order-item-list.component.html",
	styleUrls: ["./customer-order-item-list.component.scss"]
})
export class CustomerOrderItemListComponent implements OnInit, OnDestroy {
	public customerDetail: UserDetail;
	public customerOrderItems: {
		orderItem: OrderItem;
		order: Order;
	}[];
	public showNoOrdersFoundError: boolean;
	public wait: boolean;
	private customerOrderItemList$: Subscription;
	private customerOrderItemListWait$: Subscription;

	constructor(
		private _customerOrderItemListService: CustomerOrderItemListService
	) {
		this.customerOrderItems = [];
	}

	ngOnInit() {
		this.onCustomerOrderItemListChange();
		this.onCustomerOrderItemListWaitChange();
	}

	ngOnDestroy() {
		this.customerOrderItemList$.unsubscribe();
		this.customerOrderItemListWait$.unsubscribe();
	}

	private onCustomerOrderItemListWaitChange() {
		this.customerOrderItemListWait$ = this._customerOrderItemListService.onWait(
			wait => {
				this.wait = wait;
			}
		);
	}

	private onCustomerOrderItemListChange() {
		this.customerOrderItemList$ = this._customerOrderItemListService.subscribe(
			customerOrderItems => {
				this.customerOrderItems = customerOrderItems;
			}
		);
	}
}
