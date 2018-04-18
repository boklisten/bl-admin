import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BlApiError, UserDetail} from '@wizardcoder/bl-model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserDetailService} from '@wizardcoder/bl-connect';
import {CustomerDetailService} from '../../customer-detail.service';

interface UserDetailPatch {
	[key: string]: any;
}

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
		this._userDetail = userDetail;
	}

	constructor(public activeModal: NgbActiveModal, private _customerDetailService: CustomerDetailService) {
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

	public onUserDetailUpdate() {
		const patchedValues = this.getPatchedValues();

		if (patchedValues !== {} || patchedValues !== null) {
			this._customerDetailService.updateCustomerDetail(patchedValues).then((updatedUserDetail: UserDetail) => {
				this.activeModal.close('user details updated');
			}).catch((blApiError: BlApiError) => {
				console.log('customerDetailModalContentComponent: could not update userDetail');
			});
		} else {
			this.activeModal.close('no updates detected');
		}
	}

	private getPatchedValues(): any {
		const userDetailPatch: UserDetailPatch = {};

		for (const key of Object.keys(this.userDetailForm.controls)) {
			if (this.userDetailForm.controls[key].dirty) {
				userDetailPatch[key] = this.userDetailForm.controls[key].value;
			}
		}

		return userDetailPatch;
	}
}
