import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {BranchStoreService} from './branch/branch-store.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app';
	public showContent: boolean;

	constructor(private _authService: AuthService, private _branchStoreService: BranchStoreService, private _router: Router) {
		this.showContent = false;

		this._router.events.subscribe(() => {
			window.scroll(0, 0);
		});

		this._authService.onLogout().subscribe(() => {
			console.log('the user logged out');
			this.showContent = false;
		});

		this._authService.onLogin().subscribe(() => {
			console.log('the user logged in');
			this.showContent = true;
		});

		this._authService.onApplicationLogout().subscribe(() => {
			console.log('the user was logged out by application');
			this.showContent = false;
		});

		this.showContent = this._authService.isLoggedIn();
	}
}
