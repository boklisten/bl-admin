import { Component, OnInit } from "@angular/core";
import { Branch, UserPermission } from "@wizardcoder/bl-model";
import { AuthService } from "../auth/auth.service";
import { CustomerSearchService } from "../customer/customer-search/customer-search.service";
import { Router } from "@angular/router";
import { BlcKeyeventDoubleShiftService } from "../bl-common/blc-keyevent/blc-keyevent-double-shift.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
	public currentBranch: Branch;
	public branches: Branch[];
	public userPermission: string;
	public username: string;
	public permission: UserPermission;
	public wait: boolean;
	public searchTerm: string;
	public headerCustomerSearchId: string;

	constructor(
		private _authService: AuthService,
		private _router: Router,
		private _blcKeyeventDoubleShiftService: BlcKeyeventDoubleShiftService,
		private _customerSearchService: CustomerSearchService
	) {
		this.searchTerm = "";
		this.headerCustomerSearchId = "headerCustomerSearch";
	}

	ngOnInit() {
		this.wait = false;

		this._blcKeyeventDoubleShiftService.onDoubleShift().subscribe(() => {
			document.getElementById(this.headerCustomerSearchId).focus();
		});

		this.permission = this._authService.getPermission();
		this.userPermission = this.translateUserPermission(this.permission);
		this.username = this._authService.getUsername();
		this.onSearchResult();
		this.onSearchResultError();
	}

	private onSearchResult() {
		this._customerSearchService.onSearchResult().subscribe(() => {
			this.wait = false;
		});
	}

	private onSearchResultError() {
		this._customerSearchService.onSearchResultError().subscribe(() => {
			this.wait = false;
		});
	}

	private translateUserPermission(userPermission: UserPermission) {
		switch (userPermission) {
			case "employee":
				return "ansatt";
			case "manager":
				return "filialsjef";
			case "admin":
				return "administrator";
			case "super":
				return "wizard";
			default:
				return "ansatt";
		}
	}

	public onUserLogout() {
		this._authService.logout();
	}

	public onCustomerSearch(searchTerm: string) {
		if (searchTerm && searchTerm.length > 3) {
			this.wait = true;
			this._customerSearchService.search(searchTerm);
			this._router.navigate(["/search/customer/result"]);
		}
	}
}
