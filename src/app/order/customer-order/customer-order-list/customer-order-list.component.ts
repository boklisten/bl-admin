import { Component, OnInit } from "@angular/core";
import { CustomerDetailService } from "../../../customer/customer-detail/customer-detail.service";
import { BlApiError, Order, UserDetail } from "@wizardcoder/bl-model";
import { OrderService } from "@wizardcoder/bl-connect";
import { Router } from "@angular/router";
import { CustomerOrderService } from "../customer-order.service";

@Component({
	selector: "app-customer-order-list",
	templateUrl: "./customer-order-list.component.html",
	styleUrls: ["./customer-order-list.component.scss"]
})
export class CustomerOrderListComponent implements OnInit {
	public customerDetail: UserDetail;
	public customerOrders: Order[];
	public wait: boolean;

	constructor(
		private _customerOrderService: CustomerOrderService,
		private _router: Router
	) {}

	ngOnInit() {
		this.onCustomerOrderChange();
		this.wait = true;
	}

	private onCustomerOrderChange() {
		this._customerOrderService.subscribe(customerOrders => {
			this.customerOrders = customerOrders;
			this.wait = false;
		});
	}

	public onCustomerOrderDetailClick(id: string) {
		this._router.navigate(["order/" + id + "/detail"]);
	}
}
