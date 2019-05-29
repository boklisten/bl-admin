import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Params } from "@angular/router";
import { UserDetailService } from "@wizardcoder/bl-connect";
import { BlApiError, UserDetail } from "@wizardcoder/bl-model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { V } from "@angular/core/src/render3";
import { CustomerDetailModalComponent } from "./customer-detail-modal/customer-detail-modal.component";
import { CustomerDetailService } from "./customer-detail.service";
import { AuthService } from "../../auth/auth.service";

@Component({
	selector: "app-customer-detail",
	templateUrl: "./customer-detail.component.html",
	styleUrls: ["./customer-detail.component.scss"]
})
export class CustomerDetailComponent implements OnInit {
	public customerDetail: UserDetail;
	public showUserDetail: boolean;
	private _currentId: string;
	public customerDetailUpdated: boolean;
	public wait: boolean;
	public warningText: string;

	constructor(
		private _route: ActivatedRoute,
		private _customerDetailService: CustomerDetailService,
		private _authService: AuthService
	) {
		this.customerDetailUpdated = false;
		this.wait = false;
		this.warningText = null;
	}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this._currentId = params["id"];

			if (this._currentId) {
				this.getUserDetails();
			}
		});

		this._customerDetailService.onCustomerDetailChange().subscribe(() => {
			this.customerDetail = this._customerDetailService.getCustomerDetail();
			this.warningText = null;
			this.wait = false;
		});
	}

	public onUserDetailUpdated() {
		this.customerDetailUpdated = true;
	}

	public isAdmin() {
		return this._authService.isAdmin();
	}

	private getUserDetails() {
		this.wait = true;
		this.warningText = null;
		this._customerDetailService
			.fetchCustomerDetail(this._currentId)
			.then((customerDetail: UserDetail) => {
				this.wait = false;
				this.customerDetail = customerDetail;
				this._customerDetailService.setCustomerDetail(
					this.customerDetail
				);
			})
			.catch(() => {
				this.warningText = "could not get customer details";
				console.log(
					"customerDetailComponent: could not fetch customerDetail"
				);
			});
	}
}
