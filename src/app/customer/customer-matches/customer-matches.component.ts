import { Component, Input, OnInit } from "@angular/core";
import { UserService } from "../../user/user.service";
import { ToasterService } from "../../toaster/toaster.service";
import { UserDetail } from "@boklisten/bl-model";
import { UserMatchService } from "@boklisten/bl-connect";

interface SimplifiedUserMatch {
	id: string;
	customerA: string;
	customerB: string;
	itemsLockedToMatch: boolean;
}

@Component({
	selector: "app-customer-matches",
	templateUrl: "./customer-matches.component.html",
	styleUrls: ["./customer-matches.component.scss"],
})
export class CustomerMatchesComponent implements OnInit {
	@Input() customer: UserDetail;
	public userMatchesLocked: boolean;
	public userMatches: SimplifiedUserMatch[];

	public isAdmin: boolean;

	constructor(
		private _userService: UserService,
		private _userMatchService: UserMatchService,
		private _toasterService: ToasterService
	) {}

	async ngOnInit() {
		this.isAdmin = this._userService.havePermission("admin");
		try {
			this.userMatches = (await this._userMatchService.get()).filter(
				(userMatch) =>
					userMatch.customerA === this.customer.id ||
					userMatch.customerB === this.customer.id
			);
			this.userMatchesLocked = this.userMatches.some(
				(userMatch) => userMatch.itemsLockedToMatch
			);
		} catch (_error) {
			// User has no matches
		}
	}

	public onLockChange() {
		this._userMatchService
			.updateLocksForCustomer(this.customer.id, this.userMatchesLocked)
			.then((result) => {
				this._toasterService.add("SUCCESS", "Match-lås ble oppdatert!");
			})
			.catch((error) => {
				this._toasterService.add("WARNING", {
					text: "Klarte ikke endre lås for overleveringer",
				});
			});
	}
}
