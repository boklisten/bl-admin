import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class UserGuardService {

	constructor(private _authService: AuthService, private _router: Router) {

	}

	public redirectToLogin(url: string) {
		this._authService.redirectUrl = url;
		this._router.navigate(['/auth/login']);
	}

}
