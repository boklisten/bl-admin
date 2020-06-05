import { Component, OnInit } from "@angular/core";
import { Item, Order, OrderItem, UserDetail } from "@wizardcoder/bl-model";
import { CustomerOrderItemListService } from "./customer-order-item-list.service";

@Component({
	selector: "app-customer-order-item-list",
	templateUrl: "./customer-order-item-list.component.html",
	styleUrls: ["./customer-order-item-list.component.scss"]
})
export class CustomerOrderItemListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrderItems: {
		orderItem: OrderItem;
		order: Order;
	}[];
	public showNoOrdersFoundError: boolean;
	public wait: boolean;

	constructor(
		private _customerOrderItemListService: CustomerOrderItemListService
	) {
		this.customerOrderItems = [];
	}

	ngOnInit() {
		this.handleCustomerOrderItemListChange();
	}

	private handleCustomerOrderItemListChange() {
		this._customerOrderItemListService.subscribe(customerOrderItems => {
			this.customerOrderItems = customerOrderItems;
			if (this.customerOrderItems.length <= 0) {
				this.showNoOrdersFoundError = true;
			} else {
				this.showNoOrdersFoundError = false;
			}
		});
	}
}
