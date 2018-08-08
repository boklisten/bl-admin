import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {UserGuardService} from './user-guard.service';


@Injectable()
export class ManagerGuardService implements CanActivate {

	constructor(private _authService: AuthService, private _userGuardService: UserGuardService) {

	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this._authService.isLoggedIn()) {
			if (this._authService.isEmployee()) {
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
