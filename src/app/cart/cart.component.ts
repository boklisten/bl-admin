import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserDetail } from "@wizardcoder/bl-model";
import { CartService } from "./cart.service";
import { CustomerService } from "../customer/customer.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbTabChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { CheckoutService } from "../checkout/checkout.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-cart",
	templateUrl: "./cart.component.html",
	styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit, OnDestroy {
	public haveCustomer: boolean;
	public cartConfirmText: string;
	public cartFailureText: string;
	public customerDetail: UserDetail;
	public activeTab: string;
	private checkoutChange$: Subscription;
	private customerChange$: Subscription;
	private custmoerClear$: Subscription;

	constructor(
		private _cartService: CartService,
		private _customerService: CustomerService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _checkoutService: CheckoutService
	) {
		this.haveCustomer = false;
	}

	ngOnInit() {
		this.handleCustomerChange();
		this.handleCustomerClear();
		this.handleCheckoutChange();
		this.updateTab();
	}

	ngOnDestroy() {
		this.checkoutChange$.unsubscribe();
		this.customerChange$.unsubscribe();
		this.custmoerClear$.unsubscribe();
	}

	public onCartConfirmed() {
		this._cartService.confirmCart();
		this.cartConfirmText = "The order was confirmed";

		setTimeout(() => {
			this.cartConfirmText = null;
		}, 2000);
	}

	public onTabChange(tabChangeEvent: NgbTabChangeEvent) {
		this.changeTab(tabChangeEvent.nextId);
	}

	private changeTab(tabName: string) {
		this._router.navigate([], {
			queryParams: { tab: tabName }
		});
		this.activeTab = tabName;
	}

	private handleCheckoutChange() {
		this.checkoutChange$ = this._checkoutService.subscribe(addedOrder => {
			this._cartService.clear();
			this._customerService.reload();
		});
	}

	private updateTab() {
		this._activatedRoute.queryParams.subscribe(params => {
			this.activeTab = params["tab"];
		});
	}

	private handleCustomerChange() {
		this.customerChange$ = this._customerService.subscribe(
			(userDetail: UserDetail) => {
				this.customerDetail = userDetail;
				this.haveCustomer = this.customerDetail ? true : false;
				this.changeTab("customer");
			}
		);
	}

	private handleCustomerClear() {
		this.custmoerClear$ = this._customerService.onClear(clear => {
			if (clear) {
				this.clear();
			}
		});
	}

	private clear() {
		this.customerDetail = null;
		this.haveCustomer = false;
	}
}
