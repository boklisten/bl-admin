import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Params} from '@angular/router';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {BlApiError, UserDetail} from '@wizardcoder/bl-model';

@Component({
	selector: 'app-customer-detail',
	templateUrl: './customer-detail.component.html',
	styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
	private _currentId: string;
	public userDetail: UserDetail;

	constructor(private _route: ActivatedRoute, private _userDetailService: UserDetailService) {

	}

	ngOnInit() {
		this._route.params.subscribe((params: Params) => {
			this._currentId = params['id'];

			if (this._currentId) {
				this._userDetailService.getById(this._currentId).then((userDetail: UserDetail) => {
					this.userDetail = userDetail;
				}).catch((blApiError: BlApiError) => {
					console.log('customerDetailComponent: could not get userdetail', blApiError);
				});
			}
		});
	}

}
