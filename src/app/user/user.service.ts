import {Injectable} from '@angular/core';
import {UserDetail, UserPermission} from '@wizardcoder/bl-model';
import {TokenService} from '@wizardcoder/bl-connect';

@Injectable()
export class UserService {

	constructor(private _tokenService: TokenService) {

	}

	getPermission(): UserPermission {
		return this._tokenService.getAccessTokenBody().permission;
	}

	getUserDetailId(): string {
		return this._tokenService.getAccessTokenBody().details;
	}

	getUsername(): string {
		return this._tokenService.getAccessTokenBody().username;
	}

	havePermission(permission: UserPermission): boolean {

		if (permission === this.getPermission() || permission === 'customer') {
			return true;
		}

		if (permission === 'manager') {
			if (this.getPermission() === 'admin' || this.getPermission() === 'super') {
				return true;
			}
		}

		if (permission === 'admin') {
			if (this.getPermission() === 'super') {
				return true;
			}
		}

		return false;
	}

}
