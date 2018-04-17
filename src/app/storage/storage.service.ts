import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class StorageService {

	constructor(private _authService: AuthService) {
		this.onLogout();
	}

	public store(key: string, value: any): any {
		localStorage.setItem(key, JSON.stringify(value));
	}

	public get(key: string): any {
		if (localStorage.getItem(key) === null) {
			return null;
		} else {
			return JSON.parse(localStorage.getItem(key));
		}
	}

	private onLogout() {
		this._authService.onLogout().subscribe(() => {
			localStorage.clear();
		});
	}

}
