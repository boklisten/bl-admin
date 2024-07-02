import { Component, Input, OnInit } from "@angular/core";
import { UserService } from "../../user/user.service";
import { ToasterService } from "../../toaster/toaster.service";
import { MatchService } from "@boklisten/bl-connect";
import { UserDetail, UserMatch } from "@boklisten/bl-model";

@Component({
	selector: "app-customer-matches",
	templateUrl: "./customer-matches.component.html",
	styleUrls: ["./customer-matches.component.scss"],
})
export class CustomerMatchesComponent implements OnInit {
	@Input() customer: UserDetail;
	public userMatchesLocked: boolean;
	public userMatches: UserMatch[];

	public isAdmin: boolean;

	constructor(
		private _userService: UserService,
		private _matchService: MatchService,
		private _toasterService: ToasterService
	) {}

	async ngOnInit() {
		this.isAdmin = this._userService.havePermission("admin");
		try {
			this.userMatches = (await this._matchService.get()).filter(
				(match): match is UserMatch =>
					match._variant === "UserMatch" &&
					(match.sender === this.customer.id ||
						match.receiver === this.customer.id)
			);
			this.userMatchesLocked = this.userMatches.some(
				(match) => match.itemsLockedToMatch
			);
		} catch (_error) {
			// User has no matches
		}
	}

	public onLockChange() {
		this._matchService
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
