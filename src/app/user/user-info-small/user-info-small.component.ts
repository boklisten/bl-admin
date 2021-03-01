import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/auth.service";
import { UserService } from "../user.service";

@Component({
	selector: "app-user-info-small",
	templateUrl: "./user-info-small.component.html",
	styleUrls: ["./user-info-small.component.scss"],
})
export class UserInfoSmallComponent implements OnInit {
	public permission: string;
	public username: string;
	public userIcon: string;
	public name: string;

	constructor(
		private _authService: AuthService,
		private _userService: UserService
	) {}

	ngOnInit() {
		this.permission = this._userService.getPermission();
		this.username = this._userService.getUsername();
		this.userIcon = this.getUserIcon(this.permission);
	}

	public getUserIcon(permission) {
		switch (permission) {
			case "employee":
				return "user";
			case "manager":
				return "user-tie";
			case "admin":
				return "user-astronaut";
			case "super":
				return "user-secret";
		}
	}
}
