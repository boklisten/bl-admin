import { Component, OnInit } from "@angular/core";
import { Branch, UserPermission } from "@boklisten/bl-model";
import { AuthService } from "../auth/auth.service";
import { BlcKeyeventDoubleShiftService } from "../bl-common/blc-keyevent/blc-keyevent-double-shift.service";
import { BranchStoreService } from "../branch/branch-store.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
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
		private _branchStoreService: BranchStoreService,
		private _blcKeyeventDoubleShiftService: BlcKeyeventDoubleShiftService
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
	}

	get getHasSelectedBranch() {
		return this._branchStoreService.haveBranch();
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
}
