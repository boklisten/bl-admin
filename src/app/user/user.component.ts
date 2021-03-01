import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { UserService } from "./user.service";

@Component({
	selector: "app-user",
	templateUrl: "./user.component.html",
	styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
	public permission: string;
	public username: string;

	constructor(
		private _authService: AuthService,
		private _router: Router,
		private _userService: UserService
	) {}

	ngOnInit() {
		this.permission = this._userService.getPermission();
		this.username = this._userService.getUsername();
	}

	onLogout() {
		this._authService.logout();
	}

	onEditDetails() {
		this._router.navigate(["/auth/register/detail"]);
	}
}
