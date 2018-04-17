import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

	constructor(private _authService: AuthService, private _router: Router) {
	}


	ngOnInit() {
	}

	onLogout() {
		this._authService.logout();
	}

	onEditDetails() {
		this._router.navigate(['/auth/details/register']);
	}

}
