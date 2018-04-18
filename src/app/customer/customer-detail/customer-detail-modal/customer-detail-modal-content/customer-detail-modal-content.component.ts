import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserDetail} from '@wizardcoder/bl-model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-customer-detail-modal-content',
	templateUrl: './customer-detail-modal-content.component.html',
	styleUrls: ['./customer-detail-modal-content.component.scss']
})
export class CustomerDetailModalContentComponent implements OnInit {

	public userDetailForm: FormGroup;
	public showContent = false;
	private _userDetail: UserDetail;

	@Input() set userDetail(userDetail: UserDetail) {
		console.log('we got the user detail', userDetail);
		this._userDetail = userDetail;
	}


	constructor(public activeModal: NgbActiveModal, private _changeDetectorRef: ChangeDetectorRef) {
		this.showContent = false;
	}

	ngOnInit() {
		this.createUserDetailForm();
	}

	get userDetail(): UserDetail {
		return this._userDetail;
	}


	private createUserDetailForm() {
		this.userDetailForm = new FormGroup({
			'name': new FormControl(this.userDetail.name, [Validators.minLength(2)]),
			'phone': new FormControl(this.userDetail.phone, [Validators.minLength(8)]),
			'address': new FormControl(this.userDetail.address, []),
			'postCode': new FormControl(this.userDetail.postCode, [Validators.minLength(4)]),
			'postCity': new FormControl(this.userDetail.postCity),
			'country': new FormControl(this.userDetail.country),
		});
		this.showContent = true;
	}
}
