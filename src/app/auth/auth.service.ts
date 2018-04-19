import {Injectable} from '@angular/core';
import {UserPermission} from '@wizardcoder/bl-model';
import {TokenService} from '@wizardcoder/bl-connect';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AuthLoginService} from '@wizardcoder/bl-login';

@Injectable()
export class AuthService {
	public redirectUrl: string;
	private _logout$: Subject<boolean>;
	private _login$: Subject<boolean>;
	private _applicationLogout$: Subject<boolean>;

	constructor(private _tokenService: TokenService, private _router: Router, private _authLoginService: AuthLoginService) {
		this._logout$ = new Subject<boolean>();
		this._login$ = new Subject<boolean>();
		this._applicationLogout$ = new Subject<boolean>();

		this._authLoginService.onLogin().subscribe(() => {
			this._login$.next(true);
		});

		this._authLoginService.onLogout().subscribe(() => {
			this._logout$.next(true);
		});
	}

	public isLoggedIn(): boolean {
		return this._authLoginService.isLoggedIn();
	}

	public isAdmin(): boolean {
		if (this._authLoginService.isLoggedIn()) {

			try {
				this._tokenService.getAccessTokenBody();
			} catch (e) {
				this.logout();
				return false;
			}

			return (this._tokenService.getAccessTokenBody().permission === 'admin');
		}
		return false;
	}

	public isEmployee(): boolean {
		if (this._authLoginService.isLoggedIn()) {

			try {
				this._tokenService.getAccessTokenBody();
			} catch (e) {
				this.logout();
				return false;
			}

			return (this.isAdmin() || this._tokenService.getAccessTokenBody().permission === 'employee');
		}
		return false;
	}

	public logout() {
		this._authLoginService.logout('/auth/menu');
	}

	public onLogin(): Observable<boolean> {
		return this._login$;
	}

	public onLogout(): Observable<boolean> {
		return this._logout$;
	}

	public applicationLogout() {
		this._applicationLogout$.next(true);
	}

	public onApplicationLogout(): Observable<boolean> {
		return this._applicationLogout$;
	}
}
