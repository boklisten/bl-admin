import {Injectable} from '@angular/core';
import {UserPermission} from '@wizardcoder/bl-model';
import {TokenService} from '@wizardcoder/bl-connect';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
	public redirectUrl: string;

	constructor(private _tokenService: TokenService, private _router: Router) {
	}

	public loggedIn(): boolean {
		return (this._tokenService.haveAccessToken() && (this.isAdmin() || this.isEmployee()));
	}

	public isAdmin(): boolean {
		if (this._tokenService.haveAccessToken()) {
			return (this._tokenService.getAccessTokenBody().permission === 'admin');
		}
		return false;
	}

	public isEmployee(): boolean {
		if (this._tokenService.haveAccessToken()) {
			return (this.isAdmin() || this._tokenService.getAccessTokenBody().permission === 'employee');
		}
		return false;
	}

	public logout() {
		this._tokenService.removeTokens();
		this._router.navigate(['/']);
	}
}
