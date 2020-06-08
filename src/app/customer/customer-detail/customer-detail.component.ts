import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { BlApiError, UserDetail } from "@wizardcoder/bl-model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomerDetailModalComponent } from "./customer-detail-modal/customer-detail-modal.component";
import { CustomerDetailService } from "./customer-detail.service";
import { AuthService } from "../../auth/auth.service";
import { CustomerService } from "../customer.service";

@Component({
	selector: "app-customer-detail",
	templateUrl: "./customer-detail.component.html",
	styleUrls: ["./customer-detail.component.scss"]
})
export class CustomerDetailComponent implements OnInit {
	public customerDetail: UserDetail;
	public showUserDetail: boolean;
	public _currentId: string;
	public customerDetailUpdated: boolean;
	public wait: boolean;
	public warningText: string;

	constructor(
		private _route: ActivatedRoute,
		private _authService: AuthService,
		private _customerService: CustomerService
	) {
		this.customerDetailUpdated = false;
		this.wait = false;
		this.warningText = null;
	}

	ngOnInit() {
		this._customerService.subscribe((customerDetail: UserDetail) => {
			this.customerDetail = customerDetail;
			this.wait = false;
		});

		this.onIdParamChange();
	}

	public onUserDetailUpdated() {
		this.customerDetailUpdated = true;
	}

	public isAdmin() {
		return this._authService.isAdmin();
	}
	private onIdParamChange() {
		this._route.params.subscribe((params: Params) => {
			this._currentId = params["id"];

			if (this._currentId) {
				this.getCustomerDetail();
			}
		});
	}

	private getCustomerDetail() {
		this.wait = true;
		this.warningText = null;

		this._customerService.set(this._currentId);
	}
}
