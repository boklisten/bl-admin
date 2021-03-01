import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserDetail } from "@boklisten/bl-model";
import { Subscription } from "rxjs";
import { CustomerService } from "../../customer/customer.service";

@Component({
	selector: "app-cart-customer",
	templateUrl: "./cart-customer.component.html",
	styleUrls: ["./cart-customer.component.scss"],
})
export class CartCustomerComponent implements OnInit, OnDestroy {
	public haveCustomer: boolean;
	customerChange$: Subscription;
	customerClear$: Subscription;

	constructor(private _customerService: CustomerService) {
		this.haveCustomer = false;
	}

	private handleCustomerChange() {
		this._customerService.onClear(() => (this.haveCustomer = false));
		this.customerChange$ = this._customerService.subscribe(
			(userDetail: UserDetail) => {
				this.haveCustomer = userDetail ? true : false;
			}
		);
		this.customerClear$ = this._customerService.onClear(
			() => (this.haveCustomer = false)
		);
	}

	ngOnDestroy(): void {
		this.customerChange$.unsubscribe();
		this.customerClear$.unsubscribe();
	}

	ngOnInit(): void {
		this.handleCustomerChange();
	}
}
