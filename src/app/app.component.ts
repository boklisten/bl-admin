import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app';
	public showContent: boolean;

	constructor(private _authService: AuthService) {
		this.showContent = false;

		this._authService.onLogout().subscribe(() => {
			console.log('the user logged out');
			this.showContent = false;
		});

		this._authService.onLogin().subscribe(() => {
			console.log('the user logged in');
			this.showContent = true;
		});

		if (this._authService.isLoggedIn()) {
			this.showContent = true;
		}
	}
}
