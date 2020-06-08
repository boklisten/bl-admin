import { Component, OnInit } from "@angular/core";
import { UserDetail } from "@wizardcoder/bl-model";
import { CartService } from "./cart.service";
import { CustomerService } from "../customer/customer.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbTabChangeEvent } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-cart",
	templateUrl: "./cart.component.html",
	styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
	public haveCustomer: boolean;
	public cartConfirmText: string;
	public cartFailureText: string;
	public customerDetail: UserDetail;
	public activeTab: string;

	constructor(
		private _cartService: CartService,
		private _customerService: CustomerService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute
	) {
		this.haveCustomer = false;
	}

	ngOnInit() {
		this.onCustomerChange();
		this.onCustomerClear();
		this.updateTab();
	}

	private updateTab() {
		this._activatedRoute.queryParams.subscribe(params => {
			this.activeTab = params["tab"];
		});
	}

	public onTabChange(tabChangeEvent: NgbTabChangeEvent) {
		this._router.navigate([], {
			queryParams: { tab: tabChangeEvent.nextId }
		});
	}

	private onCustomerChange() {
		this._customerService.subscribe((userDetail: UserDetail) => {
			this.customerDetail = userDetail;
			this.haveCustomer = this.customerDetail ? true : false;
			this.updateTab();
		});
	}

	private onCustomerClear() {
		this._customerService.onClear(clear => {
			if (clear) {
				this.clear();
			}
		});
	}

	private clear() {
		this.customerDetail = null;
		this.haveCustomer = false;
	}

	public onCartConfirmed() {
		this._cartService.confirmCart();
		this.cartConfirmText = "The order was confirmed";

		setTimeout(() => {
			this.cartConfirmText = null;
		}, 2000);
	}

	public onCartFailed() {}
}
