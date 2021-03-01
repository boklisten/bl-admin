import { Component, OnInit, OnDestroy } from "@angular/core";
import { Order, UserDetail } from "@boklisten/bl-model";
import { Router } from "@angular/router";
import { CustomerOrderService } from "../customer-order.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-order-list",
	templateUrl: "./customer-order-list.component.html",
	styleUrls: ["./customer-order-list.component.scss"],
})
export class CustomerOrderListComponent implements OnInit, OnDestroy {
	public customerDetail: UserDetail;
	public customerOrders: Order[];
	public wait: boolean;
	private customerOrders$: Subscription;
	private customerOrderWait$: Subscription;

	constructor(
		private _customerOrderService: CustomerOrderService,
		private _router: Router
	) {}

	ngOnInit() {
		this.customerOrders = [];
		this.onCustomerOrderChange();
		this.onCustomerOrderWaitChange();
	}

	ngOnDestroy() {
		this.customerOrders$.unsubscribe();
		this.customerOrderWait$.unsubscribe();
	}

	public onCustomerOrderDetailClick(id: string) {
		this._router.navigate(["order/" + id + "/detail"]);
	}

	private onCustomerOrderWaitChange() {
		this.customerOrderWait$ = this._customerOrderService.onWait((wait) => {
			this.wait = wait;
		});
	}

	private onCustomerOrderChange() {
		this.customerOrders$ = this._customerOrderService.subscribe(
			(customerOrders) => {
				this.customerOrders = customerOrders;
			}
		);
	}
}
