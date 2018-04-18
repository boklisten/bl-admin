import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Params} from '@angular/router';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {BlApiError, UserDetail} from '@wizardcoder/bl-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {V} from '@angular/core/src/render3';
import {CustomerDetailModalComponent} from './customer-detail-modal/customer-detail-modal.component';

@Component({
	selector: 'app-customer-detail',
	templateUrl: './customer-detail.component.html',
	styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
	private _currentId: string;
	public userDetail: UserDetail;
	public showUserDetail: boolean;

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

	public onShowUserDetail() {
		this.showUserDetail = !this.showUserDetail;
	}
}
