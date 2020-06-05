import { Component, OnInit, OnDestroy } from "@angular/core";
import { Item, Order, OrderItem, UserDetail } from "@wizardcoder/bl-model";
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
	private customerOrderItemListSubscription: Subscription;

	constructor(
		private _customerOrderItemListService: CustomerOrderItemListService
	) {
		this.customerOrderItems = [];
	}

	ngOnInit() {
		this.wait = true;
		this.handleCustomerOrderItemListChange();
	}

	ngOnDestroy() {
		this.customerOrderItemListSubscription.unsubscribe();
	}

	private handleCustomerOrderItemListChange() {
		this.customerOrderItemListSubscription = this._customerOrderItemListService.subscribe(
			customerOrderItems => {
				this.customerOrderItems = customerOrderItems;
				this.wait = false;
				/*
				if (this.customerOrderItems.length <= 0) {
					this.showNoOrdersFoundError = true;
				} else {
					this.showNoOrdersFoundError = false;
				}
        */
			}
		);
	}
}
