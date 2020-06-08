import { Component, HostListener, OnInit } from "@angular/core";

import { UserDetail } from "@wizardcoder/bl-model";
import { Router } from "@angular/router";
import { CustomerService } from "../customer.service";

@Component({
	selector: "app-customer-current",
	templateUrl: "./customer-current.component.html",
	styleUrls: ["./customer-current.component.scss"]
})
export class CustomerCurrentComponent implements OnInit {
	public customerDetail: UserDetail;
	public lastPopoverRef: any;
	public wait: boolean;

	constructor(
		private _router: Router,
		private _customerService: CustomerService
	) {}

	ngOnInit() {
		this.wait = true;
		this.onCustomerChange();
	}

	private onCustomerChange() {
		this._customerService.subscribe((customerDetail: UserDetail) => {
			this.customerDetail = customerDetail;
			this.wait = false;
		});
	}

	public onClearCustomer() {
		this.customerDetail = null;
		this._customerService.clear();
	}

	public onReloadCustomer() {
		this._customerService.reload();
	}

	public onViewCustomerDetail() {
		this._router.navigate([
			"/customer/" + this.customerDetail.id + "/detail"
		]);
		this.lastPopoverRef.close();
	}

	public onChangeCustomerDetail() {
		this._router.navigate(["/search"]);
		this.lastPopoverRef.close();
	}

	@HostListener("document:click", ["$event"])
	clickOutside(event) {
		// If there's a last element-reference AND the click-event target is outside this element
		if (this.lastPopoverRef && this.lastPopoverRef._elementRef) {
			if (
				!this.lastPopoverRef._elementRef.nativeElement.contains(
					event.target
				)
			) {
				this.lastPopoverRef.close();
				this.lastPopoverRef = null;
			}
		}
	}

	setCurrentPopoverOpen(popReference) {
		// If there's a last element-reference AND the new reference is different
		if (this.lastPopoverRef && this.lastPopoverRef !== popReference) {
			this.lastPopoverRef.close();
		}
		// Registering new popover ref
		this.lastPopoverRef = popReference;
	}
}
