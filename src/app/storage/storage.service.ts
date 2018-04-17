import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class StorageService {

	constructor(private _authService: AuthService) {
		this.onLogout();
	}

	private onLogout() {
		this._authService.onLogout().subscribe(() => {
			localStorage.clear();
		});
	}

	public store(key: string, value: any): any {
		localStorage.setItem(key, JSON.stringify(value));
	}

	public get(key: string): any {
		return JSON.parse(localStorage.getItem(key));
	}

}
