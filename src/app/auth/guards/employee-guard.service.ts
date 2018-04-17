import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {UserGuardService} from './user-guard.service';


@Injectable()
export class EmployeeGuardService implements CanActivate {

	constructor(private _userService: AuthService, private _userGuardService: UserGuardService) {

	}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this._userService.isEmployee()) {
			return true;
		}
		this._userGuardService.redirectToLogin(state.url);
		return false;
	}
}
