import { Injectable } from "@angular/core";
import { UserDetail, UserPermission } from "@wizardcoder/bl-model";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
	public permission: string;
	public username: string;

	constructor(private _authService: AuthService) {}

	public getPermission(): UserPermission {
		return this._authService.getPermission();
	}

	public getUsername(): string {
		return this._authService.getUsername();
	}

	public getUserDetailId(): string {
		return this._authService.getUserDetailId();
	}

	public havePermission(permission: UserPermission): boolean {
		if (permission === this.getPermission() || permission === "employee") {
			return true;
		}

		if (permission === "manager") {
			if (
				this.getPermission() === "admin" ||
				this.getPermission() === "super"
			) {
				return true;
			}
		}

		if (permission === "admin") {
			if (this.getPermission() === "super") {
				return true;
			}
		}

		return false;
	}
}
