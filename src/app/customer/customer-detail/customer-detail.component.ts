import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { UserDetailService } from "@boklisten/bl-connect";
import { BlApiError, UserDetail } from "@boklisten/bl-model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomerDetailModalComponent } from "./customer-detail-modal/customer-detail-modal.component";
import { CustomerDetailService } from "./customer-detail.service";
import { AuthService } from "../../auth/auth.service";
import { CustomerService } from "../customer.service";
import { Subscription } from "rxjs";

@Component({
	selector: "app-customer-detail",
	templateUrl: "./customer-detail.component.html",
	styleUrls: ["./customer-detail.component.scss"],
})
export class CustomerDetailComponent implements OnInit {
	public customerDetail: UserDetail;
	public showUserDetail: boolean;
	public _currentId: string;
	public customerDetailUpdated: boolean;
	public wait: boolean;
	public warningText: string;
	private customer$: Subscription;
	private customerWait$: Subscription;

	constructor(
		private _route: ActivatedRoute,
		private _authService: AuthService,
		private _customerService: CustomerService,
		private _customerDetailService: CustomerDetailService
	) {
		this.customerDetailUpdated = false;
		this.warningText = null;
		this._currentId = _customerDetailService.getId();
	}

	ngOnInit() {
		this.onCustomerChange();
		this.onCustomerWaitChange();
	}

	ngOnDestroy() {
		this.customer$.unsubscribe();
		this.customerWait$.unsubscribe();
	}

	public onUserDetailDeleted() {
		this.customerDetail = null;
		this.reload();
	}

	public onUserDetailEmailChange() {
		this._customerService.reload();
	}

	public onUserDetailUpdated() {
		this.customerDetailUpdated = true;
	}

	public isAdmin() {
		return this._authService.isAdmin();
	}

	public isManager() {
		return this._authService.isManager();
	}

	private reload() {
		this.setCustomerDetailIfNotSet();
	}

	private onCustomerChange() {
		this.customer$ = this._customerService.subscribe(
			(customerDetail: UserDetail) => {
				this.customerDetail = customerDetail;
			}
		);
	}

	private onCustomerWaitChange() {
		this.customerWait$ = this._customerService.onWait((wait) => {
			this.wait = wait;
		});
	}

	private setCustomerDetailIfNotSet() {
		try {
			let customerDetailId = this._customerDetailService.getId();

			if (this._currentId !== customerDetailId) {
				this.setCustomerDetail();
			}
		} catch (e) {
			this.setCustomerDetail();
		}
	}

	private setCustomerDetail() {
		this.wait = true;
		this.warningText = null;

		this._customerService.set(this._currentId);
	}
}
