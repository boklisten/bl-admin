import { Component, OnInit, OnDestroy } from "@angular/core";

import { UserDetail } from "@boklisten/bl-model";
import { Router } from "@angular/router";
import { CustomerService } from "../customer.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-current",
	templateUrl: "./customer-current.component.html",
	styleUrls: ["./customer-current.component.scss"],
})
export class CustomerCurrentComponent implements OnInit, OnDestroy {
	public customerDetail: UserDetail;
	public wait: boolean;
	private customer$: Subscription;
	private customerWait$: Subscription;
	private navigateToCart: boolean;
	private customerClear$: Subscription;

	constructor(
		private _router: Router,
		private _customerService: CustomerService
	) {}

	ngOnInit() {
		this.handleCustomerChange();
		this.handleCustomerWaitChange();
		this.handleCustomerClearChange();
	}

	ngOnDestroy() {
		this.customer$.unsubscribe();
		this.customerWait$.unsubscribe();
		this.customerClear$.unsubscribe();
	}

	public onClearCustomer() {
		this.customerDetail = null;
		this._customerService.clear();
	}

	public onReloadCustomer() {
		this._customerService.reload();
	}

	public onCustomerNameClick() {
		if (this.navigateToCart) {
			this.navigateToCart = false;
			this._router.navigate(["/cart"]);
		} else {
			this.navigateToCart = true;
			this._router.navigate(["/customer/detail"]);
		}
	}

	private handleCustomerChange() {
		this.customer$ = this._customerService.subscribe(
			(customerDetail: UserDetail) => {
				this.customerDetail = customerDetail;
			}
		);
	}

	private handleCustomerClearChange() {
		this.customerClear$ = this._customerService.onClear(() => {
			this.customerDetail = null;
		});
	}

	private handleCustomerWaitChange() {
		this.customerWait$ = this._customerService.onWait((wait) => {
			this.wait = wait;
		});
	}
}
