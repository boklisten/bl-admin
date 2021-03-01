import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth.service";
import { UserGuardService } from "./user-guard.service";

@Injectable()
export class AdminGuardService implements CanActivate {
	constructor(
		private _authService: AuthService,
		private _router: Router,
		private _userGuardService: UserGuardService
	) {}

	public canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean {
		if (this._authService.isLoggedIn()) {
			if (this._authService.isAdmin()) {
				return true;
			} else {
				this._userGuardService.redirectToPermissionDenied(state.url);
			}
		} else {
			this._userGuardService.redirectToLogin(state.url);
		}

		return false;
	}
}
