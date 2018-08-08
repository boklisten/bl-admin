import {Injectable} from '@angular/core';
import {UserPermission} from '@wizardcoder/bl-model';
import {TokenService} from '@wizardcoder/bl-connect';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {AuthLoginService} from '@wizardcoder/bl-login';
import {StorageService} from '../storage/storage.service';

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
		let permission: UserPermission;

		try {
			permission = this.getUserPermission();
		} catch (e) {
			return false;
		}

		return (permission === 'admin');
	}


	public isManager(): boolean {
		let permission: UserPermission;

		try {
			permission = this.getUserPermission();
		} catch (e) {
			return false;
		}

		return (this.isAdmin() || permission === 'manager');
	}

	public isEmployee(): boolean {
		let permission: UserPermission;

		try {
			permission = this.getUserPermission();
		} catch (e) {
			return false;
		}

		return (this.isAdmin() || this.isManager() || permission === 'employee');
	}

	private getUserPermission(): UserPermission {
		if (this._authLoginService.isLoggedIn()) {
			try {
				this._tokenService.getAccessTokenBody();
			} catch (e) {
				this.logout();
				throw e;
			}

			return this._tokenService.getAccessTokenBody().permission;
		}
	}

	public logout() {
		this._logout$.next(true);
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
